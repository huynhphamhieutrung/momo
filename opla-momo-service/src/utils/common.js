const {uid} = require('rand-token');

const stripVN = (str) => {
  const accentsMap = [
    'aàảãáạăằẳẵắặâầẩẫấậ', 'AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ',
    'dđ', 'DĐ',
    'eèẻẽéẹêềểễếệ', 'EÈẺẼÉẸÊỀỂỄẾỆ',
    'iìỉĩíị', 'IÌỈĨÍỊ',
    'oòỏõóọôồổỗốộơờởỡớợ', 'OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ',
    'uùủũúụưừửữứự', 'UÙỦŨÚỤƯỪỬỮỨỰ',
    'yỳỷỹýỵ', 'YỲỶỸÝỴ',
  ];

  for (let i = 0; i < accentsMap.length; i++) {
    const re = new RegExp('[' + accentsMap[i].substr(1) + ']', 'g');
    const char = accentsMap[i][0];
    str = str.replace(re, char);
  }

  return str;
};

const slugify = (str) => {
  return stripVN(str).toLowerCase()
                     .replace(/[^a-z0-9]/, '-')
                     .replace(' ', '-')
                     .replace(/^-+|-+$/g, '')
                     .replace(/--+/g, '-');
};

const generateSlug = (str) => {
  const result = slugify(str);
  return `${result}-${uid(16)}`;
};

module.exports = {stripVN, slugify, generateSlug};
