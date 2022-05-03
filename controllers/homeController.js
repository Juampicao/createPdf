const fs = require("fs");
const pdf = require("pdf-creator-node");
const path = require("path");
const options = require("../helpers/options");
const data = require("../helpers/data");
// const data2 = require("../helpers/data2");

const homeview = (req, res, next) => {
  res.render("home");
};

const generatePdf = async (req, res, next) => {
  const html = fs.readFileSync(
    path.join(__dirname, "../views/template2.html"),
    "utf-8"
  );
  const filename = "JugadorCampito" + "_doc" + ".pdf";
  let array = [];

  data.forEach((d) => {
    const prod = {
      name: d.name,
      description: d.description,
      unit: d.unit,
      quantity: d.quantity,
      price: d.price,
      total: d.quantity * d.price,
      imgurl: d.imgurl,
    };
    array.push(prod);
  });

  // data2.forEach((d) => {
  //   const prod = {
  //     nombre: d.nombre,
  //     informacion: d.informacion,
  //     estado: d.estado,
  //   };
  //   array.push(prod);
  // });

  let subtotal = 0;
  array.forEach((i) => {
    subtotal += i.total;
  });
  const tax = (subtotal * 20) / 100;
  const grandtotal = subtotal - tax;
  const obj = {
    prodlist: array,
    subtotal: subtotal,
    tax: tax,
    gtotal: grandtotal,
  };
  const document = {
    html: html,
    data: {
      products: obj,
    },
    path: "./docs/" + filename,
  };
  pdf
    .create(document, options)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
  const filepath = "http://localhost:3000/docs/" + filename;

  res.render("download", {
    path: filepath,
  });
};

module.exports = {
  homeview,
  generatePdf,
};
