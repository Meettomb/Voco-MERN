import { useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Extension } from "@tiptap/core";
import Image from "@tiptap/extension-image";

/* ---------------- FONT SIZE EXTENSION ---------------- */
const CopyIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
        <rect x="2" y="2" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
    </svg>
);
const FontSize = Extension.create({
    name: "fontSize",

    addGlobalAttributes() {
        return [
            {
                types: ["textStyle"],
                attributes: {
                    fontSize: {
                        default: null,
                        parseHTML: element => element.style.fontSize,
                        renderHTML: attributes => {
                            if (!attributes.fontSize) return {};
                            return {
                                style: `font-size: ${attributes.fontSize};`,
                            };
                        },
                    },
                },
            },
        ];
    },

    addCommands() {
        return {
            setFontSize:
                fontSize =>
                    ({ chain }) =>
                        chain().setMark("textStyle", { fontSize }).run(),
        };
    },
});

/* ---------------- RESIZABLE IMAGE ---------------- */

const ResizableImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),

            width: {
                default: "300px",
                parseHTML: element => element.getAttribute("width"),
                renderHTML: attributes => {
                    if (!attributes.width) return {};
                    return { width: attributes.width };
                },
            },

            align: {
                default: "left",
                parseHTML: element => element.getAttribute("data-align"),
                renderHTML: attributes => {
                    if (!attributes.align) return {};
                    return { "data-align": attributes.align };
                },
            },

            preview: {
                default: null,
                parseHTML: () => null, // do NOT save preview
                renderHTML: () => ({}), // do NOT render in HTML
            },
        };
    },

    addNodeView() {
        return ({ node, editor, getPos }) => {
            const container = document.createElement("div");
            container.style.position = "relative";
            container.style.display = "block";

            const img = document.createElement("img");
            img.src = node.attrs.preview || node.attrs.src;
            img.style.width = node.attrs.width || "300px";
            img.style.height = "auto";
            img.style.display = "block";
            img.style.transition = "outline 0.2s ease";

            // Alignment
            if (node.attrs.align === "center") {
                img.style.margin = "0 auto";
            } else if (node.attrs.align === "right") {
                img.style.margin = "0 0 0 auto";
            } else {
                img.style.margin = "0";
            }

            const handle = document.createElement("div");
            handle.style.width = "12px";
            handle.style.height = "12px";
            handle.style.background = "#2563eb";
            handle.style.position = "absolute";
            handle.style.right = "0";
            handle.style.bottom = "0";
            handle.style.cursor = "nwse-resize";
            handle.style.display = "none";

            img.addEventListener("click", e => {
                e.stopPropagation();
                const pos = getPos();
                editor.commands.setNodeSelection(pos);
                img.style.outline = "2px solid #2563eb";
                handle.style.display = "block";
            });

            document.addEventListener("click", e => {
                if (!container.contains(e.target)) {
                    img.style.outline = "none";
                    handle.style.display = "none";
                }
            });

            let startX, startWidth;

            handle.addEventListener("mousedown", e => {
                e.preventDefault();
                e.stopPropagation();

                startX = e.clientX;
                startWidth = img.offsetWidth;

                const onMouseMove = e => {
                    const newWidth = startWidth + (e.clientX - startX);
                    img.style.width = newWidth + "px";

                    editor
                        .chain()
                        .focus()
                        .updateAttributes("image", {
                            width: newWidth + "px",
                        })
                        .run();
                };

                const onMouseUp = () => {
                    document.removeEventListener("mousemove", onMouseMove);
                    document.removeEventListener("mouseup", onMouseUp);
                };

                document.addEventListener("mousemove", onMouseMove);
                document.addEventListener("mouseup", onMouseUp);
            });

            container.appendChild(img);
            container.appendChild(handle);

            return {
                dom: container,
            };
        };
    },
});

/* ---------------- COMPONENT ---------------- */

export default function RichEditor({ value, onChange }) {
    const fileInputRef = useRef(null);
    const [showHtmlPreview, setShowHtmlPreview] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                underline: false,   // disable built-in
            }),
            Underline,
            TextStyle,
            FontSize,
            ResizableImage,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) return null;

    /* ---------------- IMAGE UPLOAD (Blob URL) ---------------- */

    const handleImageUpload = event => {
        const file = event.target.files[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file); // temporary blob preview
        const fileName = file.name;                   // actual filename

        editor
            .chain()
            .focus()
            .setImage({
                src: fileName,     // ✅ store filename ONLY
                preview: previewUrl, // temporary preview
                width: "300px",
            })
            .run();
    };

    const setFontSize = size => {
        if (!size) return;
        editor.chain().focus().setFontSize(size).run();
    };

    const handleCopyHTML = () => {
        if (!editor) return;

        const html = editor.getHTML();

        navigator.clipboard.writeText(html)
            .then(() => {
                alert("HTML copied!");
            })
            .catch(() => {
                alert("Copy failed");
            });
    };


    return (
        <div className="editor-wrapper">

            {/* TOOLBAR */}
            <div
                className="editor-toolbar"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "10px",
                }}
            >

                {/* LEFT SIDE BUTTONS */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>

                    <select onChange={e => setFontSize(e.target.value)}>
                        <option value="">Size</option>
                        <option value="12px">12</option>
                        <option value="14px">14</option>
                        <option value="16px">16</option>
                        <option value="20px">20</option>
                        <option value="24px">24</option>
                        <option value="32px">32</option>
                    </select>

                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        style={{ fontWeight: "normal" }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 4h8a4 4 0 010 8H6z" />
                            <path d="M6 12h9a4 4 0 010 8H6z" />
                        </svg>
                    </button>

                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        style={{ fontWeight: "normal" }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="19" y1="4" x2="10" y2="4" />
                            <line x1="14" y1="20" x2="5" y2="20" />
                            <line x1="15" y1="4" x2="9" y2="20" />
                        </svg>
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        style={{ fontWeight: "normal" }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 4v6a6 6 0 0012 0V4" />
                            <line x1="4" y1="20" x2="20" y2="20" />
                        </svg>
                    </button>

                    <select
                        onChange={e => {
                            const level = parseInt(e.target.value);
                            if (level === 0) {
                                editor.chain().focus().setParagraph().run();
                            } else {
                                editor.chain().focus().toggleHeading({ level }).run();
                            }
                        }}
                    >
                        <option value="0">Heading</option>
                        <option value="1">H1</option>
                        <option value="2">H2</option>
                        <option value="3">H3</option>
                    </select>

                    <button
                        onClick={() => editor.chain().focus().setTextAlign("left").run()}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="12" x2="15" y2="12" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>
                    <button
                        onClick={() => editor.chain().focus().setTextAlign("center").run()}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="6" y1="12" x2="18" y2="12" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>
                    <button
                        onClick={() => editor.chain().focus().setTextAlign("right").run()}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="9" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>

                    <button onClick={() => fileInputRef.current.click()}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <path d="M21 15l-5-5L5 21" />
                        </svg>
                    </button>


                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleImageUpload}
                    />

                    {editor.isActive("image") && (
                        <>
                            <button
                                onClick={() =>
                                    editor.chain().focus().updateAttributes("image", { align: "left" }).run()
                                }
                            >
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <rect x="3" y="6" width="10" height="12" rx="2" />
                                    <line x1="3" y1="4" x2="21" y2="4" />
                                    <line x1="3" y1="20" x2="21" y2="20" />
                                </svg>
                            </button>

                            <button
                                onClick={() =>
                                    editor.chain().focus().updateAttributes("image", { align: "center" }).run()
                                }
                            >
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <rect x="7" y="6" width="10" height="12" rx="2" />
                                    <line x1="3" y1="4" x2="21" y2="4" />
                                    <line x1="3" y1="20" x2="21" y2="20" />
                                </svg>
                            </button>

                            <button
                                onClick={() =>
                                    editor.chain().focus().updateAttributes("image", { align: "right" }).run()
                                }
                            >
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <rect x="11" y="6" width="10" height="12" rx="2" />
                                    <line x1="3" y1="4" x2="21" y2="4" />
                                    <line x1="3" y1="20" x2="21" y2="20" />
                                </svg>
                            </button>
                        </>
                    )}
                    <button onClick={handleCopyHTML} title="">
                        <CopyIcon />
                    </button>

                </div>

                {/* RIGHT SIDE PREVIEW BUTTON */}
                <button
                    onClick={() => setShowHtmlPreview(prev => !prev)}
                    style={{
                        background: showHtmlPreview ? "#2563eb" : "#e5e7eb",
                        color: showHtmlPreview ? "#fff" : "#000",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                    }}
                >
                    {showHtmlPreview ? "Editor View" : "Preview HTML"}
                </button>



            </div>

            {/* CONTENT AREA */}
            {showHtmlPreview ? (
                <pre
                    style={{
                        background: "#111827",
                        color: "#e5e7eb",
                        padding: "16px",
                        borderRadius: "8px",
                        overflowX: "auto",
                        minHeight: "200px",
                        marginTop: "10px",
                    }}
                >
                    {editor.getHTML().replace(/></g, ">\n<")}
                </pre>
            ) : (
                <EditorContent editor={editor} className="editor-content" />
            )}
        </div>
    );
}