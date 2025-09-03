import type { APIRoute } from "astro";
import { getRekapTahunan, processRekap } from "./repo/transaction";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const year = parseInt(url.searchParams.get("tahun") || "2025");

  const tahun = new URL(request.url).searchParams.get("tahun");
  console.log("", tahun)

  const data = await getRekapTahunan(year);

  if (data == undefined) {
    return new Response(
      JSON.stringify({
        data,
      }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const rekap = processRekap(data);

  const pendapatan = rekap.pendapatan;
  const pengeluaran = rekap.pengeluaran;

  return new Response(
    JSON.stringify({
      data: rekap.data,
      meta: {
        pendapatan,
        pengeluaran,
      },
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};
