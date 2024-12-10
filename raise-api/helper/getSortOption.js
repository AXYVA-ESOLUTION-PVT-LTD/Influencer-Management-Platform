function getSortOption(sortObject) {
  if (
    !sortObject ||
    typeof sortObject !== "object" ||
    Object.keys(sortObject).length === 0
  ) {
    return {};
  }

  const sortOption = {};

  for (const [field, isDescending] of Object.entries(sortObject)) {
    if (field === "title" || field === "type") {
      sortOption[field] = isDescending ? -1 : 1;
    }
  }
  return sortOption;
}

module.exports = { getSortOption };
