import { DataTypes, Model, type Sequelize } from "sequelize";

export class RefreshToken extends Model {
  declare id: number;
  declare userId: number;
  declare tokenId: string;
  declare tokenHash: string;
  declare isRevoked: boolean;
  declare expiresAt: Date;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export const initializeRefreshTokenModel = (sequelize: Sequelize) => {
  RefreshToken.init(
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id"
      },
      tokenId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        field: "token_id"
      },
      tokenHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: "token_hash"
      },
      isRevoked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "is_revoked"
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "expires_at"
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
      modelName: "RefreshToken",
      tableName: "refresh_tokens",
      underscored: true
    }
  );
};
