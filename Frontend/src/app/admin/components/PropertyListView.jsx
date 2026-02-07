// import { Link } from "react-router-dom";

// export default function PropertyListView({ properties }) {
//   return (
//     <div
//       className="

//         rounded-2xl overflow-hidden
//         bg-white dark:bg-black
//         border border-slate-200 dark:border-neutral-800
//       "
//     >
//       {/* HEADER (HIDDEN ON MOBILE) */}
//       <div
//         className="
//           hidden md:grid
//           grid-cols-[2fr_1fr_1fr_1fr_32px]
//           px-6 py-4
//           text-[11px]
//           tracking-widest
//           uppercase
//           text-slate-500 dark:text-neutral-500
//           border-b border-slate-200 dark:border-neutral-800
//         "
//       >
//         <div>Property</div>
//         <div>Price</div>
//         <div>Location</div>
//         <div>Status</div>
//         <div />
//       </div>

//       {/* ROWS */}
//       {properties.map((p) => {
//         const cover = p.cover ||
//           p.images?.find((i) => i.type === "cover")?.url ||
//           "/placeholder.jpg";

//         return (
//           <Link
//             key={p._id}
//             to={`/admin/properties/${p._id}`}
//             className="
//               group
//               flex flex-col md:grid
//               md:grid-cols-[2fr_1fr_1fr_1fr_32px]
//               gap-4 md:gap-0
//               px-5 md:px-6 py-4 md:py-5
//               border-b border-slate-200 dark:border-neutral-800
//               hover:bg-slate-50 dark:hover:bg-neutral-900/60
//               transition
//             "
//           >
//             {/* PROPERTY */}
//             <div className="flex items-center gap-4">
//               <img
//                 src={cover}
//                 alt={p.propertyName}
//                 className="h-8 w-8 rounded-md object-cover shrink-0"
//               />

//               <div>
//                 <p className="text-sm  text-slate-900 dark:text-white leading-tight">
//                   {p.propertyName}
//                 </p>
//                 <p className="text-xs text-slate-500 dark:text-neutral-400">
//                   {p.propertyType?.replace("_", " ")}
//                 </p>
//               </div>
//             </div>

//             {/* PRICE */}
//             <div className="text-sm font-medium text-slate-900 dark:text-white">
//               ₹ {p.priceLakhs?.toLocaleString()} L
//             </div>

//             {/* LOCATION */}
//             <div className="text-sm text-slate-600 dark:text-neutral-400">
//               {p.city || p.location?.city || "—"}
//             </div>

//             {/* STATUS */}
//             <div>
//               <span
//                 className={`
//                   inline-flex items-center
//                   px-3 py-1
//                   rounded-full
//                   text-xs font-semibold
//                   ${p.availabilityStatus === "available" &&
//                   "bg-green-500/15 text-green-600 dark:text-green-400"}
//                   ${p.availabilityStatus === "hold" &&
//                   "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400"}
//                   ${p.availabilityStatus === "sold" &&
//                   "bg-slate-200 text-slate-700 dark:bg-neutral-700 dark:text-neutral-300"}
//                   ${p.availabilityStatus === "rented" &&
//                   "bg-blue-500/15 text-blue-600 dark:text-blue-400"}
//                 `}
//               >
//                 {p.availabilityStatus}
//               </span>
//             </div>

//             {/* ARROW */}
//             <div
//               className="
//                 hidden md:flex
//                 justify-end
//                 text-slate-400 dark:text-neutral-600
//                 group-hover:text-slate-900 dark:group-hover:text-white
//                 transition
//               "
//             >
//               <i className="fas fa-chevron-right text-sm" />
//             </div>
//           </Link>
//         );
//       })}
//     </div>
//   );
// }

// New Version
import { Link } from "react-router-dom";

export default function PropertyListView({ properties }) {
	if (!properties || properties.length === 0) {
		return (
			<div className="text-center py-10 text-slate-500">
				No properties to display
			</div>
		);
	}

	// Helper for safe image
	const getImageUrl = (p) => {
		if (p.cover)
			return typeof p.cover === "string" ? p.cover : p.cover.secure_url;
		if (p.gallery && p.gallery.length > 0) {
			const first = p.gallery[0];
			return typeof first === "string" ? first : first.secure_url;
		}
		return "https://via.placeholder.com/100?text=No+Img";
	};

	return (
		<div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-neutral-800">
			<table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
				<thead className="bg-slate-50 dark:bg-neutral-900 text-xs uppercase font-semibold text-slate-900 dark:text-white">
					<tr>
						<th className="px-6 py-4">Property</th>
						<th className="px-6 py-4">Price</th>
						<th className="px-6 py-4">Location</th>
						<th className="px-6 py-4">Type</th>
						<th className="px-6 py-4">Status</th>
						<th className="px-6 py-4 text-right">Action</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-slate-200 dark:divide-neutral-800 bg-white dark:bg-neutral-950">
					{properties.map((p) => (
						<tr
							key={p._id}
							className="hover:bg-slate-50 dark:hover:bg-neutral-900/50 transition"
						>
							{/* PROPERTY NAME & IMAGE */}
							<td className="px-6 py-4">
								<div className="flex items-center gap-4">
									<div className="h-12 w-12 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
										<img
											src={getImageUrl(p)}
											alt=""
											className="h-full w-full object-cover"
											onError={(e) =>
												(e.target.src =
													"https://via.placeholder.com/100?text=No+Img")
											}
										/>
									</div>
									<div>
										{/* ✅ SCHEMA FIX: propertyName */}
										<div className="font-medium text-slate-900 dark:text-white line-clamp-1">
											{p.propertyName || "Untitled Property"}
										</div>
										{/* ✅ SCHEMA FIX: areaSqFt */}
										<div className="text-xs text-slate-400">
											{p.areaSqFt ? `${p.areaSqFt} sq.ft` : "Area N/A"}
										</div>
									</div>
								</div>
							</td>

							{/* ✅ SCHEMA FIX: priceLakhs */}
							<td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-200">
								₹ {p.priceLakhs ? Number(p.priceLakhs).toLocaleString() : "0"} L
							</td>

							{/* ✅ SCHEMA FIX: city */}
							<td className="px-6 py-4">{p.city || p.location?.city || "—"}</td>

							{/* ✅ SCHEMA FIX: propertyType */}
							<td className="px-6 py-4 capitalize">
								{p.propertyType ? p.propertyType.replace("_", " ") : "—"}
							</td>

							{/* ✅ SCHEMA FIX: availabilityStatus */}
							<td className="px-6 py-4">
								<span
									className={`
                    px-3 py-1 rounded-full text-xs font-medium
                    ${p.availabilityStatus === "available" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : ""}
                    ${p.availabilityStatus === "sold" ? "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400" : ""}
                    ${p.availabilityStatus === "hold" ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" : ""}
                    ${p.availabilityStatus === "rented" ? "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400" : ""}
                  `}
								>
									{(p.availabilityStatus || "Unknown").toUpperCase()}
								</span>
							</td>

							{/* ACTION */}
							<td className="px-6 py-4 text-right">
								<Link
									to={`/admin/properties/${p._id}`}
									className="text-slate-400 hover:text-black dark:hover:text-white transition"
								>
									<i className="fas fa-chevron-right" />
								</Link>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
