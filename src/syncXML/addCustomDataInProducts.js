const state = require("./state");
const slugify = require("slugify");
const moment = require("moment");

/**
 *
 * @param {*} product
 */
function _title(product) {
  if ("title" in product) {
    title = product.title;
  } else {
    throw new Error("O produto não possui TITULO");
  }
  return title;
}

/**
 *
 * @param {*} product
 */
function _price(product) {
  if ("price" in product) {
    price = product.price;
  } else {
    throw new Error("O produto não possui Preço");
  }
  return price;
}

/**
 *
 * @param {*} product
 */
function _brand(content) {
  return content.production.brand.name;
}

/**
 *
 * @param {*} product
 */
function _domain(content) {
  return content.production.brand.domain;
}

/**
 *
 * @param {*} product
 * @param {*} brand
 */
function _gender(product, brand) {
  let gender = "";

  if (product.hasOwnProperty("gender")) {
    gender = product.gender.toLowerCase();
  } else {
    gender = "";
  }

  return brand.fidexGender ? brand.fidexGender : gender;
}

/**
 *
 * @param {*} product
 * @param {*} brand
 */
function _age_group(product, brand) {
  let age_group = "";

  if (product.hasOwnProperty("gender")) {
    // verfico s age_group e verdade pois undefined da erro para toLowerCase()
    age_group = product.age_group ? product.age_group.toLowerCase() : "";
  } else {
    age_group = "";
  }

  // Caso Genero seja fixo no cadastra da Marca e será automaticamente "adult"
  return brand.fidexGender ? "adult" : age_group;
}

/**
 *
 * @param {*} product
 */
function _image_link(product) {
  let image = "";

  if ("image_link" in product) {
    image = product.image_link;
  } else {
    throw new Error("O produto não possui IMAGEM");
  }

  return image;
}

/**
 *
 * @param {*} product
 */
function _size(product) {
  let size = "";

  if ("size" in product) {
    size = product.size;
  } else {
    // throw new Error("O produto não possui TAMANHO")
  }

  return size.toUpperCase();
}

/**
 *
 * @param {*} product
 */
function _color(product) {
  let color = "";

  if ("color" in product) {
    color = product.color;
  } else {
    // throw new Error("O produto não possui TAMANHO")
  }

  return color.toUpperCase();
}

/**
 *
 * @param {*} link
 * @obs Pego o final do atributo link para criar o slud no produto
 */
function _slug(link, suffix) {
  if (!link) return "";

  const split = link.split("/");
  const length = split.length;
  let slug = split[length - 1];

  slug = slug === "p" ? split[length - 2] : slug;

  return slugify(`${slug}-${suffix}`, {
    replacement: "-",
    lower: true
  });
}

function _tags(product) {
  let str = product.tags;

  if (product.brand) str = str.concat(product.brand + ", ");
  if (product.gender) str = str.concat(product.gender + ", ");
  if (product.age_group) str = str.concat(product.ager_group + ", ");
  if (product.size) str = str.concat(product.size + ", ");
  if (product.color) str = str.concat(product.color + ", ");

  return str;
}

function _sync() {
  return {
    status: "",
    stage: "",
    idportaldotricot: "",
    date: moment().format("DD/MM/YYYY HH:mm:ss"),
    metafields: {},
    date: "",
    errors: []
  };
}

function _traeatProduts(content) {
  content.original.products = content.original.products.map(product => {
<<<<<<< HEAD
    let sync = _sync();
=======
    let sync = _sync()
>>>>>>> eb7c6a6f2898a81cf5049dbc8eb5ec0eceebf71c
    try {
      // Forço o nome da Marca com dados cadastrado no AptecHub
      product.title = _title(product);
      product.price = _price(product);
      product.brand = _brand(content);
      product.domain = _domain(content);
      product.published = true;
      product.image_link = _image_link(product);
      product.size = _size(product);
      product.color = _color(product);

      // Alugns XML não possuem o campo age_group, assim seto o valor do atributo no cadastro da Marca
      product.age_group = _age_group(product, content.production.brand);
      product.gender = _gender(product, content.production.brand);

      // Shopify exige o slug(handle)
      product.slug = _slug(product.link, `${product.id}-${product.brand}`);
      product.tags = _tags(product);
    } catch (err) {
      sync = {
        ...product.sync,
        status: "error",
        date: moment().format("DD/MM/YYYY HH:mm:ss"),
        errors: err.message
      };
    }

    return {
      ...product,
      sync
    };
  });
}

const init = async objContentFilesPath => {
  //console.log("---> addCustomDataInProducts")

  const content = state.load(objContentFilesPath);

  _traeatProduts(content);

<<<<<<< HEAD
  state.save(objContentFilesPath, content);
};

module.exports = init;
=======
  state.save(objContentFilesPath, content)
}
module.exports = init
>>>>>>> eb7c6a6f2898a81cf5049dbc8eb5ec0eceebf71c
