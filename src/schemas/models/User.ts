import { DataTypes, Model, type Sequelize } from "sequelize";

export class User extends Model {
  declare id: string;
  declare roleId: string;
  declare name: string;
  declare email: string;
  declare passwordHash: string;
  declare deleted: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export const initializeUserModel = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      roleId: {
        type: DataTypes.UUID,
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
      deleted: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
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
