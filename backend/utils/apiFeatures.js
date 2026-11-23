const { trusted } = require("mongoose");

// Query values arrive as strings. Arrays and objects are ignored.
const toString = (value) => (typeof value === "string" ? value : undefined);

const toNumber = (value) => {
  const str = toString(value);
  if (str === undefined || str.trim() === "") return undefined;
  const num = Number(str);
  return Number.isFinite(num) ? num : undefined;
};

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const RANGE_FIELDS = ["price", "ratings"];
const RANGE_OPERATORS = ["gt", "gte", "lt", "lte"];

class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = toString(this.queryStr.keyword);

    if (keyword) {
      this.query = this.query.find({
        name: trusted({ $regex: escapeRegex(keyword), $options: "i" }),
      });
    }

    return this;
  }

  // Accepts only category and price/ratings ranges, e.g. ?price[gte]=10&category=Laptop
  filter() {
    const filter = {};

    const category = toString(this.queryStr.category);
    if (category) filter.category = category;

    for (const field of RANGE_FIELDS) {
      const range = {};

      for (const op of RANGE_OPERATORS) {
        const value = toNumber(this.queryStr[`${field}[${op}]`]);
        if (value !== undefined) range[`$${op}`] = value;
      }

      if (Object.keys(range).length > 0) filter[field] = trusted(range);
    }

    this.query = this.query.find(filter);
    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Math.max(1, Math.floor(toNumber(this.queryStr.page) || 1));

    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

module.exports = ApiFeatures;
