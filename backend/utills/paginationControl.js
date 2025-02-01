/**
 * Extracts pagination parameters from the request query.
 *
 * @param {object} query - The query object from the request.
 * @returns {object} An object containing the current page, limit, and calculated skip value.
 *
 * Example:
 *   const { page, limit, skip } = getPaginationParams(req.query);
 */
export const getPaginationParams = (query) => {
  // Use provided query values or default to page 1 and limit 10.
  const page = parseInt(query.page, 10) || 1
  const limit = parseInt(query.limit, 10) || 10
  const skip = (page - 1) * limit
  return { page, limit, skip }
}

/**
 * Formats the paginated results for a response.
 *
 * @param {number} totalItems - The total number of items available.
 * @param {Array} items - The items retrieved for the current page.
 * @param {number} page - The current page number.
 * @param {number} limit - The number of items per page.
 * @returns {object} An object containing pagination details along with the items.
 *
 * Example:
 *   const paginatedData = formatPaginationResult(totalCount, quests, page, limit);
 *   res.json(paginatedData);
 */
export const formatPaginationResult = (totalItems, items, page, limit) => {
  const totalPages = Math.ceil(totalItems / limit)
  return {
    totalItems,
    items,
    totalPages,
    currentPage: page,
  }
}
