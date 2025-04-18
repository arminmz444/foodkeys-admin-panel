import _ from "@lodash";
/**
 * The Pagination DTO
 */
const PaginationDTO = (data) =>
  _.defaults(data || {}, {
    pageNumber: 1,
    pageSize: 10,
    // TODO: SORT AND FILTER
  });
export default PaginationDTO;
