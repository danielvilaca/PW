import { supabase } from '../services/supabaseClient';
// import jsPDF from 'jspdf';


// const bucket = 'faturas-pdf';

export const fetchFaturas = async ({ admin = false } = {}) => {
  const uid = (await supabase.auth.getUser()).data.user.id;
  let query = supabase.from('faturas').select('*').order('ano', { ascending: false }).order('mes', { ascending: false });
  if (!admin) query = query.eq('user_id', uid);
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const pagarFatura = async (id) => {

  const { data: fatura, error: upErr } = await supabase
    .from('faturas')
    .update({ pago: true })
    .eq('id', id)
    .select('*')
    .single();
  if (upErr) throw upErr;


  // const doc = new jsPDF();
  // doc.text(`Recibo de Pagamento`, 20, 20);
  // doc.text(`Fatura #${fatura.id}`, 20, 30);
  // doc.text(`Valor: €${fatura.valor}`, 20, 40);
  // doc.text(`Data: ${new Date().toLocaleDateString()}`, 20, 50);
  // const pdfBlob = doc.output('blob');


  // const { error: storeErr } = await supabase
  //   .storage.from(bucket)
  //   .upload(`${id}.pdf`, pdfBlob, { upsert: true, contentType: 'application/pdf' });
  // if (storeErr) throw storeErr;


  // const publicURL = supabase.storage.from(bucket).getPublicUrl(`${id}.pdf`).data.publicUrl;
  // await supabase.from('faturas').update({ pdf_url: publicURL }).eq('id', id);
};
