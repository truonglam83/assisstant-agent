"use client";

import { useState, type FormEvent } from "react";
import type { MockAgent } from "@/lib/mock/agents";
import { Dialog } from "@/components/ui/dialog";
import {
  AGENT_SKILL_OPTIONS,
  AGENT_TOOL_OPTIONS,
  agentsApi,
  type AgentModel,
  type AgentSkillKey,
  type AgentToolKey,
} from "@/lib/api/agents";

function toggleInSet<T>(set: Set<T>, key: T): Set<T> {
  const next = new Set(set);
  if (next.has(key)) {
    next.delete(key);
  } else {
    next.add(key);
  }
  return next;
}

function ToggleChip({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      className={`flex h-10 items-center gap-2 rounded-full border px-3 text-sm ${
        checked ? "border-accent bg-accent-soft" : "border-border-input"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-[18px] w-[18px] accent-accent"
      />
      {label}
    </label>
  );
}

export function AgentFormModal({
  mode,
  agent,
  onClose,
  onRequestDelete,
}: {
  mode: "create" | "edit";
  agent?: MockAgent;
  onClose: () => void;
  onRequestDelete?: () => void;
}) {
  const [name, setName] = useState(agent?.name ?? "");
  const [description, setDescription] = useState(agent?.description ?? "");
  const [instructions, setInstructions] = useState(agent?.instructions ?? "");
  const [canDo, setCanDo] = useState(agent?.canDo.join("\n") ?? "");
  const [cannotDo, setCannotDo] = useState(agent?.cannotDo.join("\n") ?? "");
  const [tools, setTools] = useState<Set<AgentToolKey>>(
    new Set(agent?.tools ?? ["save_record", "schedule"]),
  );
  const [skills, setSkills] = useState<Set<AgentSkillKey>>(new Set(agent?.skills ?? []));
  const [model, setModel] = useState<AgentModel>(agent?.model ?? "haiku");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nhập tên agent đã nhé.");
      return;
    }
    setSubmitting(true);
    setError(null);

    const input = {
      name: name.trim(),
      description: description.trim(),
      instructions,
      canDo,
      cannotDo,
      tools: Array.from(tools),
      skills: Array.from(skills),
      model,
    };

    try {
      if (mode === "create") {
        await agentsApi.create(input);
      } else if (agent) {
        await agentsApi.update(agent.slug, input);
      }
      onClose();
    } catch {
      setError("Có lỗi xảy ra, thử lại nhé.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div className="flex flex-col gap-1">
            <h2 className="font-serif text-xl font-semibold text-text">
              {mode === "create" ? "Tạo agent mới" : `Sửa ${agent?.name}`}
            </h2>
            <p className="text-xs text-text-muted">
              {mode === "create"
                ? "Tạo xong sẽ mở tab Rule để thêm rule đầu tiên."
                : "Đổi thông tin, tool và skill của agent."}
            </p>
          </div>
          <button
            type="button"
            aria-label="Đóng"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-text-muted"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto px-6 py-4">
          {error ? (
            <div role="alert" className="rounded-lg border border-danger-border bg-danger-bg px-3 py-2 text-sm text-danger-text">
              {error}
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_150px]">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="agent-name" className="text-[13px] font-semibold text-text">
                Tên
              </label>
              <input
                id="agent-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Chi tiêu"
                className="h-10 rounded-lg border border-border-input px-3 text-sm text-text"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="agent-model" className="text-[13px] font-semibold text-text">
                Model
              </label>
              <select
                id="agent-model"
                value={model}
                onChange={(e) => setModel(e.target.value as AgentModel)}
                className="h-10 rounded-lg border border-border-input bg-white px-2 text-sm text-text"
              >
                <option value="haiku">Haiku (rẻ)</option>
                <option value="sonnet">Sonnet</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="agent-desc" className="text-[13px] font-semibold text-text">
              Mô tả ngắn{" "}
              <span className="font-normal text-text-muted">
                · chat chung dựa vào đây để gợi ý agent
              </span>
            </label>
            <input
              id="agent-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ghi lại khoản chi, theo dõi ngân sách, báo cáo cuối tháng"
              className="h-10 rounded-lg border border-border-input px-3 text-sm text-text"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="agent-inst" className="text-[13px] font-semibold text-text">
              Hướng dẫn
            </label>
            <textarea
              id="agent-inst"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={2}
              placeholder="Bạn là trợ lý quản lý chi tiêu cá nhân. Ghi lại từng khoản chi theo danh mục và báo cáo khi được hỏi."
              className="resize-y rounded-lg border border-border-input px-3 py-2 text-sm leading-relaxed text-text"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="agent-can" className="text-[13px] font-semibold text-text">
                Làm được <span className="font-normal text-text-muted">· mỗi dòng một việc</span>
              </label>
              <textarea
                id="agent-can"
                value={canDo}
                onChange={(e) => setCanDo(e.target.value)}
                rows={3}
                placeholder={"Ghi khoản chi\nTổng hợp theo tháng\nCảnh báo vượt ngân sách"}
                className="resize-y whitespace-pre-line rounded-lg border border-border-input px-3 py-2 text-sm leading-relaxed text-text"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="agent-cannot" className="text-[13px] font-semibold text-text">
                Không làm được
              </label>
              <textarea
                id="agent-cannot"
                value={cannotDo}
                onChange={(e) => setCannotDo(e.target.value)}
                rows={3}
                placeholder={"Chuyển tiền\nĐọc tài khoản ngân hàng"}
                className="resize-y whitespace-pre-line rounded-lg border border-border-input px-3 py-2 text-sm leading-relaxed text-text"
              />
            </div>
          </div>

          <fieldset className="flex flex-col gap-2 border-0 p-0">
            <legend className="pb-1 text-[13px] font-semibold text-text">
              Công cụ <span className="font-normal text-text-muted">· chọn trong các công cụ đã có</span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {AGENT_TOOL_OPTIONS.map((opt) => (
                <ToggleChip
                  key={opt.key}
                  label={opt.label}
                  checked={tools.has(opt.key)}
                  onChange={() => setTools((prev) => toggleInSet(prev, opt.key))}
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-2 border-0 p-0">
            <legend className="pb-1 text-[13px] font-semibold text-text">
              Skill <span className="font-normal text-text-muted">· chọn trong các skill đã có, không bắt buộc</span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {AGENT_SKILL_OPTIONS.map((opt) => (
                <ToggleChip
                  key={opt.key}
                  label={opt.label}
                  checked={skills.has(opt.key)}
                  onChange={() => setSkills((prev) => toggleInSet(prev, opt.key))}
                />
              ))}
            </div>
          </fieldset>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-2 border-t border-border px-6 py-4">
          {mode === "edit" && onRequestDelete ? (
            <button
              type="button"
              onClick={onRequestDelete}
              className="text-sm font-medium text-danger"
            >
              Xoá agent
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-lg border border-border-input px-4.5 text-sm font-medium text-text"
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="h-11 rounded-lg bg-accent px-5 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-60"
            >
              {submitting ? "Đang lưu…" : mode === "create" ? "Tạo agent" : "Lưu thay đổi"}
            </button>
          </div>
        </div>
      </form>
    </Dialog>
  );
}
