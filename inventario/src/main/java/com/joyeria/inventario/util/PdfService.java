package com.joyeria.inventario.util;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import com.joyeria.inventario.entity.DetalleVenta;
import com.joyeria.inventario.entity.Venta;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class PdfService {

    private static final Font FONT_TITULO = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD, new BaseColor(180, 140, 50));
    private static final Font FONT_SUBTITULO = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD, BaseColor.DARK_GRAY);
    private static final Font FONT_NORMAL = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL, BaseColor.BLACK);
    private static final Font FONT_BOLD = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, BaseColor.BLACK);
    private static final Font FONT_HEADER_TABLE = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, BaseColor.WHITE);
    private static final BaseColor COLOR_DORADO = new BaseColor(180, 140, 50);
    private static final BaseColor COLOR_GRIS = new BaseColor(245, 245, 245);

    public byte[] generarBoletaVenta(Venta venta) throws DocumentException {
        Document document = new Document(PageSize.A4, 40, 40, 40, 40);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        PdfWriter.getInstance(document, out);
        document.open();

        // HEADER
        agregarHeader(document, venta);

        // ESPACIO
        document.add(Chunk.NEWLINE);

        // DATOS CLIENTE Y VENTA
        agregarDatosClienteVenta(document, venta);

        document.add(Chunk.NEWLINE);

        // TABLA DE PRODUCTOS
        agregarTablaProductos(document, venta);

        document.add(Chunk.NEWLINE);

        // TOTAL
        agregarTotal(document, venta);

        document.add(Chunk.NEWLINE);

        // PAGOS
        agregarPagos(document, venta);

        document.add(Chunk.NEWLINE);

        // FOOTER
        agregarFooter(document);

        document.close();
        return out.toByteArray();
    }

    private void agregarHeader(Document document, Venta venta) throws DocumentException {
        // Línea dorada superior
        PdfPTable lineaTop = new PdfPTable(1);
        lineaTop.setWidthPercentage(100);
        PdfPCell lineaCell = new PdfPCell();
        lineaCell.setBackgroundColor(COLOR_DORADO);
        lineaCell.setFixedHeight(5f);
        lineaCell.setBorder(Rectangle.NO_BORDER);
        lineaTop.addCell(lineaCell);
        document.add(lineaTop);

        document.add(Chunk.NEWLINE);

        // Título
        Paragraph titulo = new Paragraph("✦ JOYERÍA ✦", FONT_TITULO);
        titulo.setAlignment(Element.ALIGN_CENTER);
        document.add(titulo);

        Paragraph subtitulo = new Paragraph("BOLETA DE VENTA", FONT_SUBTITULO);
        subtitulo.setAlignment(Element.ALIGN_CENTER);
        document.add(subtitulo);

        document.add(Chunk.NEWLINE);

        // Línea dorada inferior
        PdfPTable lineaBottom = new PdfPTable(1);
        lineaBottom.setWidthPercentage(100);
        PdfPCell lineaCell2 = new PdfPCell();
        lineaCell2.setBackgroundColor(COLOR_DORADO);
        lineaCell2.setFixedHeight(2f);
        lineaCell2.setBorder(Rectangle.NO_BORDER);
        lineaBottom.addCell(lineaCell2);
        document.add(lineaBottom);
    }

    private void agregarDatosClienteVenta(Document document, Venta venta) throws DocumentException {
        PdfPTable tabla = new PdfPTable(2);
        tabla.setWidthPercentage(100);
        tabla.setWidths(new float[]{1, 1});

        // Datos del cliente
        PdfPCell celdaCliente = new PdfPCell();
        celdaCliente.setBorder(Rectangle.NO_BORDER);
        celdaCliente.addElement(new Paragraph("CLIENTE", FONT_SUBTITULO));
        celdaCliente.addElement(new Paragraph(venta.getCliente().getNombre(), FONT_NORMAL));
        if (venta.getCliente().getDocumento() != null)
            celdaCliente.addElement(new Paragraph("Doc: " + venta.getCliente().getDocumento(), FONT_NORMAL));
        if (venta.getCliente().getTelefono() != null)
            celdaCliente.addElement(new Paragraph("Tel: " + venta.getCliente().getTelefono(), FONT_NORMAL));
        tabla.addCell(celdaCliente);

        // Datos de la venta
        PdfPCell celdaVenta = new PdfPCell();
        celdaVenta.setBorder(Rectangle.NO_BORDER);
        celdaVenta.setHorizontalAlignment(Element.ALIGN_RIGHT);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        celdaVenta.addElement(new Paragraph("BOLETA N°: " + venta.getId().substring(0, 8).toUpperCase(), FONT_BOLD));
        celdaVenta.addElement(new Paragraph("Fecha: " + venta.getCreatedAt().format(formatter), FONT_NORMAL));
        celdaVenta.addElement(new Paragraph("Estado: " + venta.getEstado().name(), FONT_NORMAL));
        celdaVenta.addElement(new Paragraph("Vendedor: " + venta.getUsuario().getNombre(), FONT_NORMAL));
        tabla.addCell(celdaVenta);

        document.add(tabla);
    }

    private void agregarTablaProductos(Document document, Venta venta) throws DocumentException {
        PdfPTable tabla = new PdfPTable(5);
        tabla.setWidthPercentage(100);
        tabla.setWidths(new float[]{3, 1, 1, 1, 2});

        // Headers
        String[] headers = {"DESCRIPCIÓN", "QUILATES", "PESO(g)", "CANT.", "SUBTOTAL"};
        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header, FONT_HEADER_TABLE));
            cell.setBackgroundColor(COLOR_DORADO);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setPadding(8);
            cell.setBorder(Rectangle.NO_BORDER);
            tabla.addCell(cell);
        }

        // Filas
        boolean gris = false;
        for (DetalleVenta detalle : venta.getDetalles()) {
            BaseColor bg = gris ? COLOR_GRIS : BaseColor.WHITE;

            PdfPCell desc = new PdfPCell(new Phrase(detalle.getProducto().getDescripcion(), FONT_NORMAL));
            desc.setBackgroundColor(bg);
            desc.setPadding(6);
            desc.setBorder(Rectangle.NO_BORDER);

            PdfPCell quilates = new PdfPCell(new Phrase(detalle.getProducto().getQuilates() + "K", FONT_NORMAL));
            quilates.setBackgroundColor(bg);
            quilates.setHorizontalAlignment(Element.ALIGN_CENTER);
            quilates.setPadding(6);
            quilates.setBorder(Rectangle.NO_BORDER);

            PdfPCell peso = new PdfPCell(new Phrase(detalle.getProducto().getPesoGramos() + "g", FONT_NORMAL));
            peso.setBackgroundColor(bg);
            peso.setHorizontalAlignment(Element.ALIGN_CENTER);
            peso.setPadding(6);
            peso.setBorder(Rectangle.NO_BORDER);

            PdfPCell cant = new PdfPCell(new Phrase(String.valueOf(detalle.getCantidad()), FONT_NORMAL));
            cant.setBackgroundColor(bg);
            cant.setHorizontalAlignment(Element.ALIGN_CENTER);
            cant.setPadding(6);
            cant.setBorder(Rectangle.NO_BORDER);

            PdfPCell subtotal = new PdfPCell(new Phrase("S/ " + detalle.getSubtotal(), FONT_NORMAL));
            subtotal.setBackgroundColor(bg);
            subtotal.setHorizontalAlignment(Element.ALIGN_RIGHT);
            subtotal.setPadding(6);
            subtotal.setBorder(Rectangle.NO_BORDER);

            tabla.addCell(desc);
            tabla.addCell(quilates);
            tabla.addCell(peso);
            tabla.addCell(cant);
            tabla.addCell(subtotal);

            gris = !gris;
        }

        document.add(tabla);
    }

    private void agregarTotal(Document document, Venta venta) throws DocumentException {
        PdfPTable tabla = new PdfPTable(2);
        tabla.setWidthPercentage(50);
        tabla.setHorizontalAlignment(Element.ALIGN_RIGHT);

        PdfPCell labelTotal = new PdfPCell(new Phrase("TOTAL", FONT_HEADER_TABLE));
        labelTotal.setBackgroundColor(COLOR_DORADO);
        labelTotal.setPadding(8);
        labelTotal.setBorder(Rectangle.NO_BORDER);

        PdfPCell valorTotal = new PdfPCell(new Phrase("S/ " + venta.getTotal(), FONT_HEADER_TABLE));
        valorTotal.setBackgroundColor(COLOR_DORADO);
        valorTotal.setHorizontalAlignment(Element.ALIGN_RIGHT);
        valorTotal.setPadding(8);
        valorTotal.setBorder(Rectangle.NO_BORDER);

        tabla.addCell(labelTotal);
        tabla.addCell(valorTotal);
        document.add(tabla);
    }

    private void agregarPagos(Document document, Venta venta) throws DocumentException {
        if (venta.getPagos() == null || venta.getPagos().isEmpty()) return;

        Paragraph tituloPagos = new Paragraph("PAGOS", FONT_SUBTITULO);
        document.add(tituloPagos);

        PdfPTable tabla = new PdfPTable(2);
        tabla.setWidthPercentage(50);
        tabla.setHorizontalAlignment(Element.ALIGN_LEFT);

        venta.getPagos().forEach(pago -> {
            PdfPCell metodo = new PdfPCell(new Phrase(pago.getMetodoPago().name(), FONT_NORMAL));
            metodo.setBorder(Rectangle.NO_BORDER);
            metodo.setPadding(4);

            PdfPCell monto = new PdfPCell(new Phrase("S/ " + pago.getMonto(), FONT_NORMAL));
            monto.setBorder(Rectangle.NO_BORDER);
            monto.setPadding(4);

            tabla.addCell(metodo);
            tabla.addCell(monto);
        });

        document.add(tabla);
    }

    private void agregarFooter(Document document) throws DocumentException {
        PdfPTable linea = new PdfPTable(1);
        linea.setWidthPercentage(100);
        PdfPCell lineaCell = new PdfPCell();
        lineaCell.setBackgroundColor(COLOR_DORADO);
        lineaCell.setFixedHeight(2f);
        lineaCell.setBorder(Rectangle.NO_BORDER);
        linea.addCell(lineaCell);
        document.add(linea);

        document.add(Chunk.NEWLINE);

        Paragraph footer = new Paragraph("Gracias por su compra ✦ Joyería", FONT_NORMAL);
        footer.setAlignment(Element.ALIGN_CENTER);
        document.add(footer);
    }
}