import { Table, Skeleton, Empty } from "antd";

export const DataTable = ({ 
  columns, 
  data, 
  loading, 
  pagination, 
  onChange,
  rowKey = "_id",
  className = "",
  ...props 
}) => {
  // If loading and no data, show skeletons
  if (loading && (!data || data.length === 0)) {
    return (
      <div className="p-4 bg-white rounded-xl border border-gray-100">
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  return (
    <div className={`premium-table-wrapper ${className}`}>
      <Table
        rowKey={rowKey}
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={pagination ? {
          ...pagination,
          showTotal: (total) => `Tổng cộng ${total} mục`,
          size: "default",
          className: "premium-pagination"
        } : false}
        onChange={onChange}
        locale={{
          emptyText: <Empty description="Không có dữ liệu" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        }}
        scroll={{ x: 'max-content' }}
        {...props}
      />
    </div>
  );
};