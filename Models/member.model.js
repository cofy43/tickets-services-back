const { Model, DataTypes } = require("sequelize");
const bcrypt = require('bcrypt')

module.exports = (sequelize) => {
  class Member extends Model {
    hashPassword () {
      const password = this.getDataValue('password')
      return new Promise((resolve, reject) => {
        bcrypt.genSalt(12, function (err, salt) {
          if (err) reject(new Error('Cannot generate salt'))
          bcrypt.hash(password, salt, function (err, hash) {
            if (err) reject(new Error('Cannot hash password'))
            resolve({ password: hash, passwordSalt: salt })
          })
        })
      })
    }

    validPassword (password) {
      return new Promise((resolve, reject) => {
        bcrypt.hash(password, this.passwordSalt, (err, hash) => {
          if (err) reject(new Error('Cannot hash password'))
          resolve(this.password === hash)
        })
      })
    }

    removePasswordAndSalt () {
      this.password = undefined
      this.passwordSalt = undefined
    }
  }

  Member.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fatherLastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      motherLastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      activeTickets: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      totalTickets: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      passwordSalt: {
        type: DataTypes.STRING,
        allowNull: true
      },
    },
    {
      sequelize,
      freezeTableName: true,
      underscored: true,
      tableName: "member",
      modelName: "member",
      hooks: {
        async beforeCreate (member) {
          await member.hashPassword().then((passObj) => {
            member.setDataValue('password', passObj.password)
            member.setDataValue('passwordSalt', passObj.passwordSalt)
          }).catch((err) => console.log(err))
        },
        async beforeUpdate (member, options) {
          if (options.fields.includes('password')) {
            const passObj = await member.hashPassword()
            member.setDataValue('password', passObj.password)
            member.setDataValue('passwordSalt', passObj.passwordSalt)
          }
        }
      }
    }
  );

  return Member;
};
