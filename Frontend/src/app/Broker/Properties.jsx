// import { useEffect, useMemo, useState } from "react";
// import { Link } from "react-router-dom";
// import api from "../../services/api";
// import BrokerLayout from "../../components/layout/BrokerLayout";

// import PropertyListView from "./components/PropertyListViewBroker";

// export default function Properties() {
//   const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [view, setView] = useState("grid");

//   const [search, setSearch] = useState("");
//   const [filters, setFilters] = useState({
//     category: "",
//     status: "",
//     city: "",
//     minPrice: "",
//   });

//   useEffect(() => {
//     api
//       .get("/broker/properties")
//       .then((res) => {

//         setProperties(res.properties || []);
//       })
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, []);

//   /* =========================
//      SEARCH + FILTER LOGIC
//   ========================= */
//   const filteredProperties = useMemo(() => {
//     return properties.filter((p) => {
//       const text = [
//         p.propertyName,
//         p.propertyCode,
//         p.description,
//         p.location?.city,
//         p.location?.address,
//         p.location?.locality,
//       ]
//         .join(" ")
//         .toLowerCase();

//       if (search && !text.includes(search.toLowerCase())) return false;
//       if (filters.category && p.propertyType !== filters.category) return false;
//       if (filters.status && p.availabilityStatus !== filters.status) return false;
//       if (filters.city && !p.location?.city?.toLowerCase().includes(filters.city.toLowerCase())) return false;
//       if (filters.minPrice && p.priceLakhs < Number(filters.minPrice)) return false;

//       return true;
//     });
//   }, [properties, search, filters]);

//   const handleFilterChange = (e) => {
//     setFilters({ ...filters, [e.target.name]: e.target.value });
//   };

//   const clearFilters = () => {
//     setSearch("");
//     setFilters({
//       category: "",
//       status: "",
//       city: "",
//       minPrice: "",
//     });
//   };

//   return (
//     <BrokerLayout>
//       <>

//         {/* SEARCH */}
//         <div className="relative px-6 pt-5">
//           <span
//             className="
//         pointer-events-none
//         absolute left-9 top-1/2 -translate-y-1/2
//         text-slate-400 dark:text-slate-500
//       "
//           >
//             <i className="fas fa-search text-xs" />
//           </span>

//           <input
//             type="text"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search by name, city, address or description"
//             className="
//         w-full
//         pl-12 pr-4 py-3
//         rounded-xl
//         text-[13px]
//         bg-slate-50/80 dark:bg-neutral-800/40
//         border border-slate-200 dark:border-neutral-700
//         text-slate-800 dark:text-slate-200
//         placeholder-slate-400
//         focus:outline-none
//         focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10
//         transition
//       "
//           />
//         </div>

//         {/* FILTERS + VIEW */}
//         <div
//           className="
//       mt-4
//       px-6 pb-5
//       flex flex-wrap items-center gap-3
//     "
//         >
//           {/* CATEGORY */}
//           <select
//             name="category"
//             value={filters.category}
//             onChange={handleFilterChange}
//             className="
//         h-9 px-4
//         rounded-full
//         text-[13px]
//         bg-slate-100/80 dark:bg-neutral-800/70
//         border border-slate-200 dark:border-neutral-700
//         text-slate-700 dark:text-slate-300
//         focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10
//       "
//           >
//             <option value="">All Types</option>
//             {["builder_floor", "flat", "kothi", "plot", "shop", "office"].map((c) => (
//               <option key={c} value={c}>
//                 {c.replace("_", " ")}
//               </option>
//             ))}
//           </select>

//           {/* STATUS */}
//           <select
//             name="status"
//             value={filters.status}
//             onChange={handleFilterChange}
//             className="
//         h-9 px-4
//         rounded-full
//         text-[13px]
//         bg-slate-100/80 dark:bg-neutral-800/70
//         border border-slate-200 dark:border-neutral-700
//         text-slate-700 dark:text-slate-300
//       "
//           >
//             <option value="">Any Status</option>
//             {["available", "hold", "sold", "rented"].map((s) => (
//               <option key={s} value={s}>
//                 {s}
//               </option>
//             ))}
//           </select>

//           {/* CITY */}
//           <input
//             name="city"
//             value={filters.city}
//             onChange={handleFilterChange}
//             placeholder="City"
//             className="
//         h-9 px-4
//         rounded-full
//         text-[13px]
//         bg-slate-100/80 dark:bg-neutral-800/70
//         border border-slate-200 dark:border-neutral-700
//         text-slate-700 dark:text-slate-300
//         placeholder-slate-400
//       "
//           />

//           {/* PRICE */}
//           <input
//             type="number"
//             name="minPrice"
//             value={filters.minPrice}
//             onChange={handleFilterChange}
//             placeholder="Min ₹ (L)"
//             className="
//         h-9 px-4
//         rounded-full
//         text-[13px]
//         bg-slate-100/80 dark:bg-neutral-800/70
//         border border-slate-200 dark:border-neutral-700
//         text-slate-700 dark:text-slate-300
//         placeholder-slate-400
//       "
//           />

//           {/* RIGHT SIDE */}
//           <div className="ml-auto flex items-center gap-3">
//             {/* CLEAR */}
//             <button
//               onClick={clearFilters}
//               className="
//           h-9 px-4
//           rounded-full
//           text-[13px] font-medium
//           text-slate-500 dark:text-slate-400
//           hover:bg-slate-100 dark:hover:bg-neutral-800
//           hover:text-slate-900 dark:hover:text-white
//           transition
//         "
//             >
//               Clear
//             </button>

//             {/* VIEW TOGGLE (APPLE STYLE) */}
//             <div
//               className="
//           inline-flex items-center
//           rounded-xl
//           bg-white/60 dark:bg-neutral-900/50
//           backdrop-blur-md
//           border border-slate-200/60 dark:border-neutral-800/70
//           p-1
//         "
//             >
//               <button
//                 onClick={() => setView("grid")}
//                 className={`
//             flex h-8 w-8 items-center justify-center
//             rounded-lg
//             transition-all
//             ${view === "grid"
//                     ? "bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-sm"
//                     : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
//                   }
//           `}
//               >
//                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
//                   <rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor" />
//                   <rect x="14" y="3" width="7" height="7" rx="1.5" fill="currentColor" />
//                   <rect x="3" y="14" width="7" height="7" rx="1.5" fill="currentColor" />
//                   <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" />
//                 </svg>
//               </button>

//               <button
//                 onClick={() => setView("list")}
//                 className={`
//             flex h-8 w-8 items-center justify-center
//             rounded-lg
//             transition-all
//             ${view === "list"
//                     ? "bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-sm"
//                     : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
//                   }
//           `}
//               >
//                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
//                   <rect x="4" y="5" width="16" height="3" rx="1.5" fill="currentColor" />
//                   <rect x="4" y="11" width="16" height="3" rx="1.5" fill="currentColor" />
//                   <rect x="4" y="17" width="16" height="3" rx="1.5" fill="currentColor" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>
//       </>

//       {
//         loading ? (
//           <div className="py-20 text-center text-slate-500">
//             Loading properties…
//           </div>
//         ) : filteredProperties.length === 0 ? (
//           <div className="py-20 text-center text-slate-500">
//             No properties found.
//           </div>
//         ) : view === "grid" ? (
//           <div className="px-10 grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             {filteredProperties.map((p) => {
//               const cover = p.cover ||
//                 p.images?.find((i) => i.type === "cover")?.url ||
//                 "/placeholder.jpg";

//               return (
//                 <div
//                   key={p._id}
//                   className="
//     group
//     rounded-2xl overflow-hidden
//     bg-white dark:bg-neutral-950
//     border border-slate-200/80 dark:border-neutral-800
//     transition-all duration-300
//     hover:-translate-y-1
//     hover:border-slate-300 dark:hover:border-neutral-600
//   "
//                 >
//                   {/* IMAGE */}
//                   <div className="relative overflow-hidden">
//                     <img
//                       src={cover}
//                       alt={p.propertyName}
//                       className="
//         w-full h-52 sm:h-56
//         object-cover
//         transition-transform duration-500
//         group-hover:scale-105
//       "
//                     />

//                     {/* IMAGE OVERLAY */}
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

//                     {/* CITY */}
//                     <div
//                       className="
//         absolute top-4 left-4
//         bg-black/60 backdrop-blur-md
//         text-white
//         px-3 py-1
//         text-xs tracking-wide
//         rounded-full
//       "
//                     >
//                       {p.city || p.location?.city || "Location"}
//                     </div>

//                     {/* STATUS */}
//                     <div
//                       className="
//         absolute bottom-4 left-4
//         bg-white/90 text-black
//         px-4 py-1
//         text-[11px]
//         font-semibold tracking-wide
//         rounded-full
//       "
//                     >
//                       {p.availabilityStatus?.toUpperCase()}
//                     </div>
//                   </div>

//                   {/* CONTENT */}
//                   <div className="px-5 pt-5 pb-4 space-y-4">
//                     {/* TITLE */}
//                     <div className="space-y-1">
//                       <h3 className="
//         text-[15px] sm:text-base
//         font-semibold
//         tracking-tight
//         text-slate-800 dark:text-slate-100
//         leading-snug
//       ">
//                         {p.propertyName || "Premium Property"}
//                       </h3>

//                       <p className="text-xs text-slate-500 dark:text-slate-400">
//                         {p.address || p.location?.address || p.location?.locality || "—"}
//                       </p>
//                     </div>

//                     {/* PRICE */}
//                     <div className="
//       text-lg sm:text-xl
//       font-semibold
//       tracking-wide
//       text-slate-900 dark:text-white
//     ">
//                       ₹ {p.priceLakhs?.toLocaleString()} L
//                     </div>

//                     {/* META */}
//                     <div
//                       className="
//         grid grid-cols-2 gap-y-2
//         pt-3
//         border-t border-slate-200/70 dark:border-neutral-800
//         text-xs
//         text-slate-600 dark:text-slate-400
//       "
//                     >
//                       <div>{p.areaSqFt} sq.ft</div>
//                       <div className="capitalize">{p.propertyType?.replace("_", " ")}</div>
//                       <div>{p.bedrooms || 0} Beds</div>
//                       <div>{p.bathrooms || 0} Baths</div>
//                     </div>
//                   </div>

//                   {/* CTA */}
//                   <Link
//                     to={`/broker/properties/${p._id}`}
//                     className="
//       block text-center
//       py-3
//       text-sm font-semibold tracking-widest
//       bg-slate-900 text-white
//       dark:bg-neutral-900 dark:text-slate-100
//       hover:bg-white hover:text-black
//       dark:hover:bg-white dark:hover:text-black
//       transition
//     "
//                   >
//                     VIEW DETAILS
//                   </Link>
//                 </div>

//               );
//             })}
//           </div>
//         ) : (
//           <div className="px-10">
//             <PropertyListView properties={filteredProperties} />
//           </div>
//           /* ✅ LIST VIEW COMPONENT */

//         )

//       }

//       <p className="text-xs text-right text-slate-400 mt-12">
//         Crafted with care ·{" "}
//         <span className="text-black dark:text-white">
//           BackendBots
//         </span>
//       </p>
//     </BrokerLayout >
//   );
// }

// New Version

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import BrokerLayout from "../../components/layout/BrokerLayout";
// ✅ Re-using Admin components to keep design consistent
import SectionHeader from "../admin/components/SectionHeader";
import PropertyListView from "../admin/components/PropertyListView";

export default function BrokerProperties() {
	const [properties, setProperties] = useState([]);
	const [loading, setLoading] = useState(true);
	const [view, setView] = useState("grid");

	const [search, setSearch] = useState("");
	const [filters, setFilters] = useState({
		category: "",
		status: "",
		city: "",
		minPrice: "",
	});

	// 1. Fetch Data
	useEffect(() => {
		setLoading(true);
		// Try the broker-specific endpoint first
		api
			.get("/broker/properties")
			.then((res) => {
				const data =
					res.properties || res.data || (Array.isArray(res) ? res : []);
				setProperties(data);
			})
			.catch((err) => {
				console.error("Broker Fetch Error:", err);
				// Fallback: If broker route fails, try admin route
				api
					.get("/admin/properties")
					.then((res) => setProperties(res.properties || []))
					.catch((e) => console.error(e));
			})
			.finally(() => setLoading(false));
	}, []);

	/* =========================
       SEARCH + FILTER LOGIC
  ========================= */
	const filteredProperties = useMemo(() => {
		if (!Array.isArray(properties)) return [];

		return properties.filter((p) => {
			const title = p.propertyName || "";
			const text = [title, p.description, p.city, p.locality, p.address]
				.join(" ")
				.toLowerCase();

			if (search && !text.includes(search.toLowerCase())) return false;
			if (
				filters.category &&
				p.propertyType !== filters.category &&
				p.category !== filters.category
			)
				return false;

			// Brokers might only see "Available", but we respect the filter if used
			if (filters.status && p.availabilityStatus !== filters.status)
				return false;

			if (
				filters.city &&
				!(p.city || "").toLowerCase().includes(filters.city.toLowerCase())
			)
				return false;
			if (filters.minPrice && (p.priceLakhs || 0) < Number(filters.minPrice))
				return false;

			return true;
		});
	}, [properties, search, filters]);

	const handleFilterChange = (e) => {
		setFilters({ ...filters, [e.target.name]: e.target.value });
	};

	const clearFilters = () => {
		setSearch("");
		setFilters({ category: "", status: "", city: "", minPrice: "" });
	};

	const getImageUrl = (p) => {
		if (p.cover)
			return typeof p.cover === "string" ? p.cover : p.cover.secure_url;
		if (p.gallery && p.gallery.length > 0) {
			const first = p.gallery[0];
			return typeof first === "string" ? first : first.secure_url;
		}
		return "https://via.placeholder.com/400x300?text=No+Image";
	};

	return (
		<BrokerLayout>
			<SectionHeader
				title="Properties"
				subtitle="Browse available inventory"
				// ❌ No "Add Property" button for Brokers
			/>

			{/* SEARCH + FILTER PANEL */}
			<div className="px-4 mb-10 rounded-2xl bg-white/70 dark:bg-neutral-900/40 backdrop-blur-lg border border-slate-200/60 dark:border-neutral-800/70 shadow-sm">
				<div className="relative px-6 pt-5">
					<span className="pointer-events-none absolute left-9 top-1/2 -translate-y-1/2 text-slate-400">
						<i className="fas fa-search text-xs" />
					</span>
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search by name, city, address or description"
						className="w-full pl-12 pr-4 py-3 rounded-xl text-[13px] bg-slate-50/80 dark:bg-neutral-800/40 border border-slate-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-neutral-700 transition"
					/>
				</div>

				<div className="mt-4 px-6 pb-5 flex flex-wrap items-center gap-3">
					<select
						name="category"
						value={filters.category}
						onChange={handleFilterChange}
						className="h-9 px-4 rounded-full text-[13px] bg-slate-100/80 dark:bg-neutral-800/70 border border-slate-200 dark:border-neutral-700 focus:outline-none"
					>
						<option value="">All Types</option>
						{["builder_floor", "flat", "kothi", "plot", "shop", "office"].map(
							(c) => (
								<option key={c} value={c}>
									{c.replace("_", " ")}
								</option>
							),
						)}
					</select>

					<select
						name="status"
						value={filters.status}
						onChange={handleFilterChange}
						className="h-9 px-4 rounded-full text-[13px] bg-slate-100/80 dark:bg-neutral-800/70 border border-slate-200 dark:border-neutral-700 focus:outline-none"
					>
						<option value="">Any Status</option>
						{["available", "hold", "sold", "rented"].map((s) => (
							<option key={s} value={s}>
								{s}
							</option>
						))}
					</select>

					<input
						name="city"
						value={filters.city}
						onChange={handleFilterChange}
						placeholder="City"
						className="h-9 px-4 rounded-full text-[13px] bg-slate-100/80 dark:bg-neutral-800/70 border border-slate-200 dark:border-neutral-700 focus:outline-none placeholder-slate-400"
					/>
					<input
						type="number"
						name="minPrice"
						value={filters.minPrice}
						onChange={handleFilterChange}
						placeholder="Min ₹ (L)"
						className="h-9 px-4 w-24 rounded-full text-[13px] bg-slate-100/80 dark:bg-neutral-800/70 border border-slate-200 dark:border-neutral-700 focus:outline-none placeholder-slate-400"
					/>

					<div className="ml-auto flex items-center gap-3">
						<button
							onClick={clearFilters}
							className="h-9 px-4 rounded-full text-[13px] font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-neutral-800 transition"
						>
							Clear
						</button>
						<div className="inline-flex items-center rounded-xl bg-white/60 dark:bg-neutral-900/50 border border-slate-200/60 dark:border-neutral-800 p-1">
							<button
								onClick={() => setView("grid")}
								className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${view === "grid" ? "bg-white dark:bg-neutral-800 shadow-sm text-black dark:text-white" : "text-slate-400"}`}
							>
								<svg
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="currentColor"
								>
									<rect x="3" y="3" width="7" height="7" rx="1.5" />
									<rect x="14" y="3" width="7" height="7" rx="1.5" />
									<rect x="3" y="14" width="7" height="7" rx="1.5" />
									<rect x="14" y="14" width="7" height="7" rx="1.5" />
								</svg>
							</button>
							<button
								onClick={() => setView("list")}
								className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${view === "list" ? "bg-white dark:bg-neutral-800 shadow-sm text-black dark:text-white" : "text-slate-400"}`}
							>
								<svg
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="currentColor"
								>
									<rect x="4" y="5" width="16" height="3" rx="1.5" />
									<rect x="4" y="11" width="16" height="3" rx="1.5" />
									<rect x="4" y="17" width="16" height="3" rx="1.5" />
								</svg>
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* RESULTS GRID */}
			{loading ?
				<div className="py-20 text-center text-slate-500">
					Loading properties...
				</div>
			: filteredProperties.length === 0 ?
				<div className="py-20 text-center text-slate-500">
					No properties found.
				</div>
			: view === "grid" ?
				<div className="px-2 grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{filteredProperties.map((p) => (
						<div
							key={p._id}
							className="group rounded-2xl overflow-hidden bg-white dark:bg-neutral-950 border border-slate-200/80 dark:border-neutral-800 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 dark:hover:border-neutral-600 shadow-sm"
						>
							<div className="relative overflow-hidden h-52 sm:h-56">
								<img
									src={getImageUrl(p)}
									alt={p.propertyName}
									className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
									onError={(e) =>
										(e.target.src =
											"https://via.placeholder.com/400x300?text=No+Image")
									}
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

								{/* 1. VISUAL FIX: If city is ROHINI, prefer Locality or Address */}
								<div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 text-xs tracking-wide rounded-full max-w-[80%] truncate">
									{p.locality || p.address || p.city || "Unknown"}
								</div>
								<div className="absolute bottom-4 left-4 bg-white/90 text-black px-4 py-1 text-[11px] font-semibold tracking-wide rounded-full shadow-sm">
									{p.availabilityStatus?.toUpperCase() || "AVAILABLE"}
								</div>
							</div>

							<div className="p-5 space-y-4">
								<div className="space-y-1">
									<h3 className="text-[15px] sm:text-base font-semibold text-slate-800 dark:text-slate-100 leading-snug line-clamp-1">
										{p.propertyName || "Untitled Property"}
									</h3>
									<p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
										{p.address ||
											p.locality ||
											p.city ||
											"Address not available"}
									</p>
								</div>

								{/* 2. VISUAL FIX: Hide "0 L" */}
								<div className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
									{p.priceLakhs && Number(p.priceLakhs) > 0 ?
										`₹ ${Number(p.priceLakhs).toLocaleString()} L`
									:	<span className="text-sm text-slate-500 font-medium bg-slate-100 dark:bg-neutral-800 px-2 py-1 rounded">
											Price on Request
										</span>
									}
								</div>

								<div className="grid grid-cols-2 gap-y-2 pt-3 border-t border-slate-200/70 dark:border-neutral-800 text-xs text-slate-600 dark:text-slate-400">
									<div>{p.areaSqFt || 0} sq.ft</div>
									<div className="capitalize">
										{p.propertyType || p.category || "Property"}
									</div>
									<div>{p.bedrooms || p.bhk || 0} Beds</div>
									<div>{p.bathrooms || 0} Baths</div>
								</div>

								<Link
									to={`/broker/properties/${p._id}`}
									className="block text-center py-3 mt-2 text-sm font-semibold tracking-widest bg-slate-900 text-white dark:bg-neutral-800 dark:text-slate-200 rounded-lg hover:bg-black dark:hover:bg-neutral-700 transition"
								>
									VIEW DETAILS
								</Link>
							</div>
						</div>
					))}
				</div>
			:	<div className="px-4">
					{/* Reuse Admin List View but filtered for Broker */}
					<PropertyListView properties={filteredProperties} />
				</div>
			}
			<p className="text-xs text-right text-slate-400 mt-12 mb-4">
				Powered By{" "}
				<span className="text-black dark:text-white font-medium">
					BackendBots
				</span>
			</p>
		</BrokerLayout>
	);
}
