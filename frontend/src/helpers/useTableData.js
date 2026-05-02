import { useState, useEffect, useCallback, useRef } from "react";

export const useTableData = (serviceFn) => {
  const [data, setData]             = useState([]);
  const [loading, setLoading]       = useState(false);
  const [pagination, setPagination] = useState({
    current: 1, pageSize: 5, total: 0,
  });

  // 🔑 useRef giữ searchText mới nhất mà không trigger re-render
  const searchRef = useRef("");

  // 🔑 useCallback để fetchData có stable reference
  const fetchData = useCallback(async (params = {}) => {
    setLoading(true);
    const res = await serviceFn({
      keyword:   params.search              || "",
      page:      params.pagination?.current  || 1,
      limit:     params.pagination?.pageSize || 5,
      sortKey:   params.sortField            || "",
      sortValue:
        params.sortOrder === "ascend"  ? "asc"  :
        params.sortOrder === "descend" ? "desc" : "",
    });

    if (res) {
      setData(res.data);
      setPagination({
        current:  res.pagination?.currentPage || 1,
        pageSize: res.pagination?.limitItems  || 5,
        total:    res.pagination?.totalPages * res.pagination?.limitItems
                  || res.data.length,
      });
    }
    setLoading(false);
  }, [serviceFn]); // ← chỉ phụ thuộc serviceFn, ổn định

  // ✅ useEffect giờ deps đầy đủ, không loop
  useEffect(() => {
    fetchData({ pagination: { current: 1, pageSize: 5 } });
  }, [fetchData]); // fetchData ổn định nhờ useCallback

  const handleTableChange = (newPagination, _filters, sorter) =>
    fetchData({
      pagination: newPagination,
      sortField:  sorter.field,
      sortOrder:  sorter.order,
      search:     searchRef.current, // ← đọc từ ref thay vì closure cũ
    });

  const onSearch = (value) => {
    searchRef.current = value;       // ← cập nhật ref trước
    fetchData({
      pagination: { current: 1, pageSize: 5 },
      search: value,
    });
  };

  const handleReload = (currentPagination) =>
    fetchData({
      pagination: currentPagination,
      search: searchRef.current,
    });

  return { data, loading, pagination, handleTableChange, onSearch, handleReload };
};