import { createClient } from "@supabase/supabase-js";
import { number } from "astro:schema";
const supabase = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_ANON_KEY,
  {
    db: { schema: "keuangan" },
  }
);

export interface Type {
  id: number;
  code_type: number;
  name: string;
}

export interface Transaction {
  id: number;
  created_at: string;
  created_by: string;
  year: number;
  month: number;
  note: string;
  code_type: number;
  money: number;
}

type RekapItem = {
  code_type: number;
  type_name: string;
  bulan_1: number;
  bulan_2: number;
  bulan_3: number;
  bulan_4: number;
  bulan_5: number;
  bulan_6: number;
  bulan_7: number;
  bulan_8: number;
  bulan_9: number;
  bulan_10: number;
  bulan_11: number;
  bulan_12: number;
  [key: string]: number | string; // untuk bulan_1 ... bulan_12 dan string lainnya
};

export interface Rekap {
  code_type: number;
  type_name: string;
  bulan_1: number;
  bulan_2: number;
  bulan_3: number;
  bulan_4: number;
  bulan_5: number;
  bulan_6: number;
  bulan_7: number;
  bulan_8: number;
  bulan_9: number;
  bulan_10: number;
  bulan_11: number;
  bulan_12: number;
}

export const getTransaction = async (
  page: number,
  pageSize: number
): Promise<Transaction[] | null> => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data: dataTrx, error: errorTrx } = await supabase
    .from("transaction")
    .select("*", { count: "exact" }) // count bisa berguna untuk total halaman
    .range(from, to)
    .order("created_at", { ascending: false });
  return dataTrx;
};

export const getType = async (): Promise<Type[] | null> => {
  const { data: dataType, error: errorType } = await supabase
    .from("type")
    .select();
  return dataType;
};

export const getRekapTahunan = async (year: number) => {
  // Ambil semua data transaksi dan type, lalu proses di client

  const { data: trxData, error: trxError } = await supabase
    .from("transaction")
    .select("code_type, month, money, year, deleted_at")
    .eq("year", year)
    .is("deleted_at", null);

  const { data: typeData, error: typeError } = await supabase
    .from("type")
    .select("code_type, name");

  if (trxError || typeError) {
    console.error("Error:", trxError || typeError);
  } else {
    const rekapMap: Record<number, RekapItem> = {};

    trxData.forEach(({ code_type, month, money }) => {
      if (!rekapMap[code_type]) {
        rekapMap[code_type] = {
          code_type,
          type_name:
            typeData.find((t) => t.code_type === code_type)?.name || "",
          bulan_1: 0,
          bulan_2: 0,
          bulan_3: 0,
          bulan_4: 0,
          bulan_5: 0,
          bulan_6: 0,
          bulan_7: 0,
          bulan_8: 0,
          bulan_9: 0,
          bulan_10: 0,
          bulan_11: 0,
          bulan_12: 0,
        };
      }
      rekapMap[code_type][`bulan_${month}`] += money;
    });

    const rekap = Object.values(rekapMap);
    // console.log(rekap);
    return rekap;
  }
};

const typeMap: Record<string, string> = {
  "4": "Pendapatan",
  "5": "Pengeluaran",
  "501": "Sandang",
  "502": "Pangan",
  "503": "Papan",
  "504": "Sekolah",
  "505": "Tagihan",
  "506": "Hiburan",
  "507": "Donasi",
  "509": "Lainnya",
};

export function processRekap(data: RekapItem[]) {
  const dataGrouped: RekapItem[] = [];
  let pendapatan = 0;
  let pengeluaran = 0;

  const totBulan: RekapItem = {
    code_type: 0,
    type_name: "Total Bulanan",
    bulan_1: 0,
    bulan_2: 0,
    bulan_3: 0,
    bulan_4: 0,
    bulan_5: 0,
    bulan_6: 0,
    bulan_7: 0,
    bulan_8: 0,
    bulan_9: 0,
    bulan_10: 0,
    bulan_11: 0,
    bulan_12: 0,
  };

  const findIndexByCode = (code: string | number) =>
    dataGrouped.findIndex((item) => item.code_type === Number(code));

  for (const dt of data) {
    const kode1 = dt.code_type.toString().substring(0, 1); // ex: "5"
    const kode2 = dt.code_type.toString().substring(0, 3); // ex: "504"

    let idx1 = findIndexByCode(kode1);
    let idx2 = findIndexByCode(kode2);
    // console.log("kode1", kode1)
    // console.log("kode2", kode2)

    // Tambahkan kode1 jika belum ada
    if (idx1 === -1 && typeMap[kode1]) {
      dataGrouped.push({
        code_type: Number(kode1),
        type_name: typeMap[kode1],
        bulan_1: 0,
        bulan_2: 0,
        bulan_3: 0,
        bulan_4: 0,
        bulan_5: 0,
        bulan_6: 0,
        bulan_7: 0,
        bulan_8: 0,
        bulan_9: 0,
        bulan_10: 0,
        bulan_11: 0,
        bulan_12: 0,
      });
      idx1 = dataGrouped.length - 1;
    }

    // Tambahkan kode2 jika belum ada
    if (idx2 === -1 && typeMap[kode2]) {
      dataGrouped.push({
        code_type: Number(kode2),
        type_name: typeMap[kode2],
        bulan_1: 0,
        bulan_2: 0,
        bulan_3: 0,
        bulan_4: 0,
        bulan_5: 0,
        bulan_6: 0,
        bulan_7: 0,
        bulan_8: 0,
        bulan_9: 0,
        bulan_10: 0,
        bulan_11: 0,
        bulan_12: 0,
      });
      idx2 = dataGrouped.length - 1;
    }

    // Akumulasi ke kode1 dan kode2
    if (idx1 !== -1) {
      dataGrouped[idx1].bulan_1 += dt.bulan_1;
      dataGrouped[idx1].bulan_2 += dt.bulan_2;
      dataGrouped[idx1].bulan_3 += dt.bulan_3;
      dataGrouped[idx1].bulan_4 += dt.bulan_4;
      dataGrouped[idx1].bulan_5 += dt.bulan_5;
      dataGrouped[idx1].bulan_6 += dt.bulan_6;
      dataGrouped[idx1].bulan_7 += dt.bulan_7;
      dataGrouped[idx1].bulan_8 += dt.bulan_8;
      dataGrouped[idx1].bulan_9 += dt.bulan_9;
      dataGrouped[idx1].bulan_10 += dt.bulan_10;
      dataGrouped[idx1].bulan_11 += dt.bulan_11;
      dataGrouped[idx1].bulan_12 += dt.bulan_12;
    }

    if (idx2 !== -1) {
      dataGrouped[idx2].bulan_1 += dt.bulan_1;
      dataGrouped[idx2].bulan_2 += dt.bulan_2;
      dataGrouped[idx2].bulan_3 += dt.bulan_3;
      dataGrouped[idx2].bulan_4 += dt.bulan_4;
      dataGrouped[idx2].bulan_5 += dt.bulan_5;
      dataGrouped[idx2].bulan_6 += dt.bulan_6;
      dataGrouped[idx2].bulan_7 += dt.bulan_7;
      dataGrouped[idx2].bulan_8 += dt.bulan_8;
      dataGrouped[idx2].bulan_9 += dt.bulan_9;
      dataGrouped[idx2].bulan_10 += dt.bulan_10;
      dataGrouped[idx2].bulan_11 += dt.bulan_11;
      dataGrouped[idx2].bulan_12 += dt.bulan_12;
    }
    // Akumulasi ke total bulanan dan pendapatan/pengeluaran
    const isPendapatan = kode1 === "4";
    const isPengeluaran = kode1 === "5";

    if (isPendapatan) {
      totBulan.bulan_1 += dt.bulan_1;
      totBulan.bulan_2 += dt.bulan_2;
      totBulan.bulan_3 += dt.bulan_3;
      totBulan.bulan_4 += dt.bulan_4;
      totBulan.bulan_5 += dt.bulan_5;
      totBulan.bulan_6 += dt.bulan_6;
      totBulan.bulan_7 += dt.bulan_7;
      totBulan.bulan_8 += dt.bulan_8;
      totBulan.bulan_9 += dt.bulan_9;
      totBulan.bulan_10 += dt.bulan_10;
      totBulan.bulan_11 += dt.bulan_11;
      totBulan.bulan_12 += dt.bulan_12;

      pendapatan +=
        dt.bulan_1 +
        dt.bulan_2 +
        dt.bulan_3 +
        dt.bulan_4 +
        dt.bulan_5 +
        dt.bulan_6 +
        dt.bulan_7 +
        dt.bulan_8 +
        dt.bulan_9 +
        dt.bulan_10 +
        dt.bulan_11 +
        dt.bulan_12;
    } else if (isPengeluaran) {
      totBulan.bulan_1 -= dt.bulan_1;
      totBulan.bulan_2 -= dt.bulan_2;
      totBulan.bulan_3 -= dt.bulan_3;
      totBulan.bulan_4 -= dt.bulan_4;
      totBulan.bulan_5 -= dt.bulan_5;
      totBulan.bulan_6 -= dt.bulan_6;
      totBulan.bulan_7 -= dt.bulan_7;
      totBulan.bulan_8 -= dt.bulan_8;
      totBulan.bulan_9 -= dt.bulan_9;
      totBulan.bulan_10 -= dt.bulan_10;
      totBulan.bulan_11 -= dt.bulan_11;
      totBulan.bulan_12 -= dt.bulan_12;

      pengeluaran +=
        dt.bulan_1 +
        dt.bulan_2 +
        dt.bulan_3 +
        dt.bulan_4 +
        dt.bulan_5 +
        dt.bulan_6 +
        dt.bulan_7 +
        dt.bulan_8 +
        dt.bulan_9 +
        dt.bulan_10 +
        dt.bulan_11 +
        dt.bulan_12;
    }

    // Tambahkan data asli
    dataGrouped.push(dt);
  }

  dataGrouped.push(totBulan);

  return {
    data: dataGrouped,
    pendapatan,
    pengeluaran,
  };
}
