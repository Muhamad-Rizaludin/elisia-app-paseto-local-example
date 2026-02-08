import { DataTypes, Model, type Sequelize } from "sequelize";

export class Role extends Model {
  declare id: string;
  declare name: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export const initializeRoleModel = (sequelize: Sequelize) => {
  Role.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
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
      modelName: "Role",
      tableName: "roles",
      underscored: true
    }
  );
};
