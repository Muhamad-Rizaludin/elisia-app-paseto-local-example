import { DataTypes, Model, type Sequelize } from "sequelize";

export class User extends Model {
  declare id: number;
  declare roleId: number;
  declare name: string;
  declare email: string;
  declare passwordHash: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export const initializeUserModel = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "role_id"
      },
      name: {
        type: DataTypes.STRING(120),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(120),
        allowNull: false,
        unique: true
      },
      passwordHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: "password_hash"
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "created_at"
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "updated_at"
      }
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      underscored: true
    }
  );
};
