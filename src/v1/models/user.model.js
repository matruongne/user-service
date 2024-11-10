const { DataTypes } = require('sequelize')
const { sequelize } = require('../configs/databases/init.mysql')
const Role = require('./role.model')

const User = sequelize.define(
	'User',
	{
		user_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		username: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
		password_hash: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
		phone: {
			type: DataTypes.STRING,
		},
		salt: {
			type: DataTypes.BLOB,
		},
		avatarUrl: {
			type: DataTypes.TEXT,
		},
		refreshToken: {
			type: DataTypes.STRING,
		},
		resetPasswordToken: {
			type: DataTypes.STRING,
		},
		role_id: {
			type: DataTypes.INTEGER,
			references: {
				model: Role,
				key: 'role_id',
			},
		},
		created_at: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
		updated_at: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
	},
	{
		timestamps: true,
		updatedAt: 'updated_at',
		createdAt: 'created_at',
	}
)

module.exports = User
