const { DataTypes } = require('sequelize')
const { sequelize } = require('../configs/databases/init.mysql')

const Role = sequelize.define(
	'Role',
	{
		role_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		role_name: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
	},
	{
		timestamps: false,
	}
)

module.exports = Role
