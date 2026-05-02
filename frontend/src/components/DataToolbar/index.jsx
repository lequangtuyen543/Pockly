import { Button, Input } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

export const DataToolbar = ({
  onSearch,
  createPath,
  createLabel = "Thêm mới",
  searchPlaceholder = "Tìm kiếm...",
  extra = null,
  showCreate = true
}) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 animate-fade-in">
    <div className="flex items-center gap-3 w-full sm:w-auto">
      <Input
        placeholder={searchPlaceholder}
        allowClear
        onChange={(e) => onSearch && onSearch(e.target.value)}
        onPressEnter={(e) => onSearch && onSearch(e.target.value)}
        prefix={<SearchOutlined className="text-gray-400" />}
        className="w-full sm:w-80 h-10 rounded-lg border-gray-200"
      />
      {extra}
    </div>

    {showCreate && createPath && (
      <Link to={createPath} className="w-full sm:w-auto">
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          className="bg-[#005daa] hover:bg-[#004785] h-10 px-6 rounded font-semibold shadow-md shadow-blue-50 w-full sm:w-auto"
        >
          {createLabel}
        </Button>
      </Link>
    )}
  </div>
);