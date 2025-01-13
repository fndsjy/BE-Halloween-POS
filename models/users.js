const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nama_depan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nama_belakang: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        const hash = bcrypt.hashSync(value, 10);
        this.setDataValue('password', hash);
      },
    },
    gender: {
      type: DataTypes.STRING(1),
      allowNull: false,
      validate: {
        isIn: [['L', 'P']], // Validasi hanya bisa L atau P
      },
    },
    tanggal_lahir: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  });

  return users;
};

