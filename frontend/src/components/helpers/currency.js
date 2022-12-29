const currRegEx = /\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g;

const currency = {
  format: function (cur) {
    return cur ? String(Number(cur).toFixed(2)).replace(currRegEx, ",") : NaN;
  },
};

export default currency;
