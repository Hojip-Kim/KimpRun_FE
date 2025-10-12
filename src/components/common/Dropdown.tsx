'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { MdOutlineKeyboardArrowDown } from '@/components/icons';
import {
  DropdownButton,
  DropdownContainer,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
  DropdownValue,
} from './style';

export interface DropdownOption<T extends string | number = string> {
  label: string;
  value: T;
  disabled?: boolean;
  iconSrc?: string;
  iconAlt?: string;
}

interface DropdownProps<T extends string | number = string> {
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
  disabled?: boolean;
  ariaLabel?: string;
  usePortal?: boolean;
}

const Dropdown = <T extends string | number = string>({
  value,
  options,
  onChange,
  disabled = false,
  ariaLabel,
  usePortal = false,
}: DropdownProps<T>) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLUListElement | null>(null);
  const [menuStyle, setMenuStyle] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const current = options.find((o) => o.value === value);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      const trigger = ref.current;
      const menu = menuRef.current;
      const target = e.target as Node;
      const clickedInsideTrigger = !!(trigger && trigger.contains(target));
      const clickedInsideMenu = !!(menu && menu.contains(target));
      if (!clickedInsideTrigger && !clickedInsideMenu) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  useEffect(() => {
    if (!open || !usePortal) return;
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const margin = 8;
      const width = rect.width;
      let left = rect.left;
      const maxLeft = window.innerWidth - width - margin;
      if (left > maxLeft) left = Math.max(margin, maxLeft);
      const top = rect.bottom + 6;
      setMenuStyle({ top, left, width });
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open, usePortal]);

  const handleSelect = (opt: DropdownOption<T>) => {
    if (disabled || opt.disabled) return;
    onChange(opt.value);
    setOpen(false);
  };

  return (
    <DropdownContainer ref={ref}>
      <DropdownButton
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => !disabled && setOpen((s) => !s)}
        $disabled={disabled}
      >
        <DropdownValue>
          {current?.iconSrc ? (
            <img src={current.iconSrc} alt={current.iconAlt || 'icon'} loading="lazy" width="16" height="16" />
          ) : null}
          <DropdownLabel>{current?.label ?? '선택'}</DropdownLabel>
        </DropdownValue>
        <MdOutlineKeyboardArrowDown size={16} />
      </DropdownButton>
      {usePortal && open && menuStyle ? (
        createPortal(
          <DropdownMenu
            role="listbox"
            $open={open}
            ref={menuRef}
            style={{
              position: 'fixed',
              top: menuStyle.top,
              left: menuStyle.left,
              width: menuStyle.width,
              right: 'auto',
            }}
          >
            {options.map((opt) => (
              <DropdownItem
                key={String(opt.value)}
                role="option"
                aria-selected={opt.value === value}
                onClick={() => handleSelect(opt)}
                $disabled={opt.disabled}
                $active={opt.value === value}
              >
                {opt.iconSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={opt.iconSrc} alt={opt.iconAlt || 'icon'} loading="lazy" width="16" height="16" />
                ) : null}
                {opt.label}
              </DropdownItem>
            ))}
          </DropdownMenu>,
          document.body
        )
      ) : (
        <DropdownMenu role="listbox" $open={open} ref={menuRef}>
          {options.map((opt) => (
            <DropdownItem
              key={String(opt.value)}
              role="option"
              aria-selected={opt.value === value}
              onClick={() => handleSelect(opt)}
              $disabled={opt.disabled}
              $active={opt.value === value}
            >
              {opt.iconSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={opt.iconSrc} alt={opt.iconAlt || 'icon'} loading="lazy" width="16" height="16" />
              ) : null}
              {opt.label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      )}
    </DropdownContainer>
  );
};

export default Dropdown;
