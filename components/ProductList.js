import Link from "next/link";

const Thumb = ({ p }) => p.thumbnail
  ? <img src={p.thumbnail} alt={p.title} loading="lazy" className="h-14 w-14 rounded bg-gray-100 object-cover" />
  : <div className="h-14 w-14 rounded bg-gray-200" />;

function Actions({ p, onEdit, onDelete }) {
  return (
    <div className="flex gap-2">
      <button className="btn-light" onClick={() => onEdit(p)}>Edit</button>
      <button className="btn-light text-red-600" onClick={() => onDelete(p)}>Delete</button>
    </div>
  );
}
export default function ProductList({ items, onEdit, onDelete }) {
  return (
    <>
      {/* Desktop: table */}
      <table className="hidden w-full bg-white text-left text-sm md:table">
        <thead className="border-b bg-gray-100"><tr>
          {["Image", "Title", "Category", "Price", "Rating", "Stock", ""].map((h) => <th key={h} className="p-3">{h}</th>)}
        </tr></thead>
        <tbody>{items.map((p) => (
          <tr key={p.id} className="border-b">
            <td className="p-3"><Thumb p={p} /></td>
            <td className="p-3"><Link className="text-blue-600 hover:underline" href={`/products/${p.id}`}>{p.title}</Link></td>
            <td className="p-3">{p.category}</td>
            <td className="p-3">${p.price}</td>
            <td className="p-3">{p.rating}</td>
            <td className="p-3">{p.stock}</td>
            <td className="p-3"><Actions p={p} onEdit={onEdit} onDelete={onDelete} /></td>
          </tr>))}
        </tbody>
      </table>
      {/* Mobile: cards */}
      <div className="space-y-3 md:hidden">{items.map((p) => (
        <div key={p.id} className="flex gap-3 rounded bg-white p-3 shadow-sm">
          <Thumb p={p} />
          <div className="flex-1 space-y-1 text-sm">
            <Link className="font-medium text-blue-600" href={`/products/${p.id}`}>{p.title}</Link>
            <p className="text-gray-500">{p.category}</p>
            <p>${p.price} · ★ {p.rating} · Stock {p.stock}</p>
            <Actions p={p} onEdit={onEdit} onDelete={onDelete} />
          </div>
        </div>))}
      </div>
    </>
  );
}
