import Header from "@/components/Header";
export default function ProductsLayout({ children }) {
  return (<><Header /><main className="mx-auto max-w-6xl p-4">{children}</main></>);
}
