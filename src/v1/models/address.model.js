const { DataTypes } = require('sequelize')
const { sequelize } = require('../configs/databases/init.mysql')

const Address = sequelize.define(
	'Address',
	{
		address_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		latitude: {
			type: DataTypes.STRING,
		},
		longitude: {
			type: DataTypes.STRING,
		},
		name: {
			type: DataTypes.STRING,
		},
		village: {
			type: DataTypes.STRING,
		},
		county: {
			type: DataTypes.STRING,
		},
		suburb: {
			type: DataTypes.STRING,
		},
		street: {
			type: DataTypes.STRING,
		},
		housenumber: {
			type: DataTypes.STRING,
		},
		city: {
			type: DataTypes.STRING,
		},
		state: {
			type: DataTypes.STRING,
		},
		country: {
			type: DataTypes.STRING,
		},
		country_code: {
			type: DataTypes.STRING,
		},
		formatted: {
			type: DataTypes.STRING,
		},
		plus_code: {
			type: DataTypes.STRING,
		},
		plus_code_short: {
			type: DataTypes.STRING,
		},
	},
	{
		timestamps: false,
	}
)

module.exports = Address
