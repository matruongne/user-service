const User = require('./user.model')
const Role = require('./role.model')
const Address = require('./address.model')
const UserAddress = require('./userAddress.model')

// User and Role - One-to-Many
Role.hasMany(User, { foreignKey: 'role_id' })
User.belongsTo(Role, { foreignKey: 'role_id' })

User.belongsToMany(Address, { through: UserAddress, foreignKey: 'user_id' })
Address.belongsToMany(User, { through: UserAddress, foreignKey: 'address_id' })

module.exports = {
	User,
	Role,
	Address,
	UserAddress,
}
