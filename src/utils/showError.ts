import { toast } from "react-toastify";

export default function showError(data: Record<string, any>, config: any) {
  console.log('🚀 ~ showError ~ data:', data);
  toast.error(data.message);
}
