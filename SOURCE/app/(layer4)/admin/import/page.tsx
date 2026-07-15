// Import — /admin/import (Layer 4). Hiện thực hoá nav item "Import" trong
// SiteHeader (trước là dead link). Theo TEMPLATE/L4/import&uploadhistorymanagement.zip.
// UI-only theo phạm vi đã chốt: state + dữ liệu lịch sử là mock, chưa nối
// upload/parse/delete thật (xem ghi chú trong ImportContentManagement.tsx).

import { ImportContentManagement } from "@/app/(layer4)/_components/ImportContentManagement";

export default function ImportPage() {
  return (
    <div className="bg-background">
      <ImportContentManagement />
    </div>
  );
}
