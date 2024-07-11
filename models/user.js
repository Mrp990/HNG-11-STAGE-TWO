module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      userId: { type: DataTypes.STRING, primaryKey: true, allowNull: false, unique: true },
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
      password: { type: DataTypes.STRING, allowNull: false },
      phone: { type: DataTypes.STRING }
    });
  
    User.associate = models => {
      User.belongsToMany(models.Organisation, { through: 'UserOrganisation' });
    };
  
    return User;
  };
  