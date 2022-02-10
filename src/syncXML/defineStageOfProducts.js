const state = require("./state");
const moment = require("moment-timezone");

function _unionTags(tags1, tags2) {
  const vtr1 = tags1.split(","),
    vtr2 = tags2.split(",");

  const union = [...new Set([...vtr1, ...vtr2])];
  const str = [...new Set([...vtr1, ...vtr2])].join(",");

  return str;
}

/**
 *
 * @param {*} product1
 * @param {*} product2
 */
function _hasDiffBetweenObjects(p1, p2) {
  // Se eu fizer delete p2.sync ele apagará o sync de todas variaveis como productProduction
  const product1 = Object.assign({}, p1);
  delete product1.sync;

  const product2 = Object.assign({}, p2);
  delete product2.sync;

  return JSON.stringify(product1) !== JSON.stringify(product2) ? true : false;
}

/**
 *
 * @param {*} stage
 * @param {*} status
 */
function _sync(sync, stage, status) {
  if (sync.stage === "error") {
    stage = "error";
  }

  return {
    ...sync,
    stage: stage,
    status: status,
    date_synced: null,
    errors: []
  };
}

/**
 *
 * @param {*} content
 */
function _defineStatusError(content) {
  // Pega os produtos originais com error
  const productsWithErrors = content.original.products.filter(
    productOriginal => {
      if (productOriginal.sync.status === "error") {
        return productOriginal;
      }
    }
  );

  productsWithErrors.forEach(productWithError => {
    let _hasProductInProduction = false;

    // Caso o produto erro já existir
    content.production.products.forEach((product, index) => {
      if (product.id === productWithError.id) {
        content.production.products[index] = productWithError;
        _hasProductInProduction = true;
      }
    });

    if (_hasProductInProduction === false) {
      content.production.products.push(productWithError);
    }
  });
}

/**
 *
 * @param {*} content
 */
function _defineStatusNew(content) {
  content.original.products.forEach(productOriginal => {
    let _hasProductInProduction = false;

    // Verifica se produto já existe em production
    content.production.products.forEach(product => {
      if (parseInt(product.id) === parseInt(productOriginal.id))
        _hasProductInProduction = true;
    });

    if (_hasProductInProduction === false) {
      content.production.products.push({
        ...productOriginal,
        sync: _sync(productOriginal.sync, "to_sync", "new")
      });
    }
  });
}

/**
 *
 * @param {*} content
 */
function _defineStatusModified(content) {
  content.production.products = content.production.products.map(
    productProduction => {
      // Descarta se o status for igual a deleted
      //   if (productProduction.sync.status === "error") return productProduction

      const productOriginal = content.original.products.find(
        productOriginal =>
          parseInt(productOriginal.id) === parseInt(productProduction.id)
      );
      // Descarta se productOriginal for undefined,
      // caso: Se o produto foi deletedo no em original
      if (typeof productOriginal === "undefined") {
        return productProduction;
      }

      // Verifica se a diff os 2 produtos
      const diffBetweenProducts = _hasDiffBetweenObjects(
        productOriginal,
        productProduction
      );

      if (diffBetweenProducts) {
        const sync = _sync(productProduction.sync, "to_sync", "modified");
        _unionTags(productOriginal.tags, productProduction.tags);
        return {
          ...productOriginal,
          tags: _unionTags(productOriginal.tags, productProduction.tags),
          published_at: productProduction.published_at,
          sync
        };
      }

      return productProduction;
    }
  );
}

/**
 *
 * @param {*} content
 */
function _defineStatusDeleted(content) {
  content.production.products = content.production.products.map(
    productProduction => {
      const productOriginal = content.original.products.find(
        productOriginal => productOriginal.id === productProduction.id
      );

      // O produto deve estar sincronizado para realizar o delete não haverá erro
      if (
        typeof productOriginal === "undefined" &&
        productProduction.sync.stage != "deleted"
      ) {
        return {
          ...productProduction,
          sync: _sync(productProduction.sync, "to_sync", "deleted")
        };
      }

      return productProduction;
    }
  );
}

/**
 *
 * @param {*} objContentFilesPath
 */
const init = async objContentFilesPath => {
  // console.log("---> defineStageOfProducts")

  const content = await state.load(objContentFilesPath);

  _defineStatusError(content);
  _defineStatusNew(content);
  _defineStatusModified(content);
  _defineStatusDeleted(content);

  await state.save(objContentFilesPath, content);
};

module.exports = init;
