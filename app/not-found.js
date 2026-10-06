import Link from "next/link";
export default function NotFound() {
  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold">Not found</h1>
      <p className="my-2 text-gray-600">We could not find what you were looking for.</p>
      <Link href="/products" className="text-blue-600 underline">Back to products</Link>
    </div>
  );
}
