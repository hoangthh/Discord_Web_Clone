import { AuthProvider } from "@/components/providers/auth-provider";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default ProtectedLayout;
