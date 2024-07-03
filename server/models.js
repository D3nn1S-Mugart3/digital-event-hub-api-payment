const { DataTypes } = require("sequelize");
const sequelize = require("./database");

const Pago = sequelize.define(
  "Pago",
  {
    pago_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    monto: DataTypes.DECIMAL(10, 2),
    fecha: DataTypes.DATE,
    tipo_pago_id: DataTypes.INTEGER,
    usuario_id: DataTypes.INTEGER,
    evento_id: DataTypes.INTEGER,
  },
  {
    tableName: "Pagos",
    timestamps: false,
  }
);

const PagoTarjeta = sequelize.define(
  "PagoTarjeta",
  {
    tarjeta_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    numero_tarjeta: DataTypes.STRING,
    fecha_expiracion: DataTypes.DATE,
    cvv: DataTypes.STRING,
    pago_id: DataTypes.INTEGER,
  },
  {
    tableName: "Pago_tarjeta",
    timestamps: false,
  }
);

Pago.hasOne(PagoTarjeta, { foreignKey: "pago_id", as: "PagoTarjeta" });
PagoTarjeta.belongsTo(Pago, { foreignKey: "pago_id", as: "Pago" });

module.exports = { Pago, PagoTarjeta };
