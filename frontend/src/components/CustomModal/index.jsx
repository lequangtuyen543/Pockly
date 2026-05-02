import { Modal } from "antd";

export const CustomModal = ({ 
  title, 
  open, 
  onCancel, 
  children, 
  footer = null, 
  width = 600,
  className = "",
  ...props 
}) => {
  return (
    <Modal
      title={<div className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-4 mb-0">{title}</div>}
      open={open}
      onCancel={onCancel}
      footer={footer}
      width={width}
      centered
      destroyOnClose
      maskStyle={{ backdropFilter: 'blur(4px)', background: 'rgba(0,0,0,0.4)' }}
      className={`premium-modal ${className}`}
      {...props}
    >
      <div className="pt-6">
        {children}
      </div>
      
    </Modal>
  );
};
