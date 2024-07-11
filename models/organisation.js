module.exports = (sequelize, DataTypes) => {
    const Organisation = sequelize.define('Organisation', {
      orgId: { type: DataTypes.STRING, primaryKey: true, allowNull: false, unique: true },
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.STRING }
    });
  
    Organisation.associate = models => {
      Organisation.belongsToMany(models.User, { through: 'UserOrganisation' });
    };
  
    return Organisation;
  };
  