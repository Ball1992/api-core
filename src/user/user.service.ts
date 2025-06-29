import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as bcrypt from "bcrypt";
import * as ExcelJS from "exceljs";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(
    createUserDto: CreateUserDto,
    createdBy: string,
    createdByName: string,
  ) {
    const existingUser = await this.prisma.sys_user.findFirst({
      where: {
        OR: [
          { email: createUserDto.email },
          { username: createUserDto.username },
        ],
      },
    });

    if (existingUser) {
      throw new BadRequestException(
        "User with this email or username already exists",
      );
    }

    const hashedPassword = createUserDto.password
      ? await bcrypt.hash(createUserDto.password, 10)
      : null;

    // Extract password from DTO to avoid passing it to Prisma
    const { password, ...userDataWithoutPassword } = createUserDto;

    return this.prisma.sys_user.create({
      data: {
        ...userDataWithoutPassword,
        password_hash: hashedPassword,
        created_by: createdBy,
        created_by_name: createdByName,
      },
      include: {
        role: true,
      },
    });
  }

  async findAll(page = 1, limit = 10, search?: string) {
    const skip = (page - 1) * limit;

    // Sanitize search input to prevent SQL injection
    const sanitizedSearch = search?.replace(/[%_\\]/g, "\\$&").trim();

    const where = sanitizedSearch
      ? {
          OR: [
            { email: { contains: sanitizedSearch, mode: "insensitive" } },
            { first_name: { contains: sanitizedSearch, mode: "insensitive" } },
            { last_name: { contains: sanitizedSearch, mode: "insensitive" } },
            { username: { contains: sanitizedSearch, mode: "insensitive" } },
          ],
          is_active: true,
        }
      : { is_active: true };

    const [users, total] = await Promise.all([
      this.prisma.sys_user.findMany({
        where,
        skip,
        take: limit,
        include: {
          role: true,
        },
        orderBy: {
          created_date: "desc",
        },
      }),
      this.prisma.sys_user.count({ where }),
    ]);

    return {
      data: users.map((user) => {
        const { password_hash: _password_hash, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.sys_user.findUnique({
      where: { id, is_active: true },
      include: {
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const { password_hash: _password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    updatedBy: string,
    updatedByName: string,
  ) {
    const user = await this.findOne(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.prisma.sys_user.findUnique({
        where: { email: updateUserDto.email },
      });
      if (existingUser) {
        throw new BadRequestException("Email already exists");
      }
    }

    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.prisma.sys_user.findUnique({
        where: { username: updateUserDto.username },
      });
      if (existingUser) {
        throw new BadRequestException("Username already exists");
      }
    }

    const updateData: any = {
      ...updateUserDto,
      updated_by: updatedBy,
      updated_by_name: updatedByName,
    };

    if (updateUserDto.password) {
      updateData.password_hash = await bcrypt.hash(updateUserDto.password, 10);
      delete updateData.password;
    }

    const updatedUser = await this.prisma.sys_user.update({
      where: { id },
      data: updateData,
      include: {
        role: true,
      },
    });

    const { password_hash: _password_hash, ...userWithoutPassword } =
      updatedUser;
    return userWithoutPassword;
  }

  async remove(id: string, deletedBy: string, deletedByName: string) {
    await this.findOne(id);

    return this.prisma.sys_user.update({
      where: { id },
      data: {
        is_active: false,
        updated_by: deletedBy,
        updated_by_name: deletedByName,
      },
    });
  }

  async exportToExcel() {
    const users = await this.prisma.sys_user.findMany({
      where: { is_active: true },
      include: {
        role: true,
      },
      orderBy: {
        created_date: "desc",
      },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users");

    // Add headers
    worksheet.columns = [
      { header: "ID", key: "id", width: 30 },
      { header: "Email", key: "email", width: 30 },
      { header: "Username", key: "username", width: 20 },
      { header: "First Name", key: "first_name", width: 20 },
      { header: "Last Name", key: "last_name", width: 20 },
      { header: "Phone Number", key: "phone_number", width: 15 },
      { header: "Role", key: "role_name", width: 20 },
      { header: "Login Method", key: "login_method", width: 15 },
      { header: "Last Login", key: "last_login_date", width: 20 },
      { header: "Created Date", key: "created_date", width: 20 },
    ];

    // Add data
    users.forEach((user) => {
      worksheet.addRow({
        id: user.id,
        email: user.email,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number,
        role_name: user.role.name,
        login_method: user.login_method,
        last_login_date: user.last_login_date,
        created_date: user.created_date,
      });
    });

    // Style headers
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    };

    return workbook;
  }
}
