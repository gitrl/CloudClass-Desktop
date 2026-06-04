import React, { FC } from 'react';
import { Popover } from '../popover';
import { Tooltip } from '../tooltip';
import { ToolItem } from './tool';
import { SvgImg, SvgIcon, SvgIconEnum } from '../svg-img';
import { InteractionStateColors } from '../../utilities/state-color';
import { useI18n } from 'agora-common-libs';

export interface CleanerItem {
  id: string;
  icon: React.ReactElement;
  name: string;
  disabled?: boolean;
}

export interface BoardCleanersProps extends ToolItem {
  cleanersList: CleanerItem[];
  onClick?: (value: string) => void;
  activeItem?: string;
  hover?: boolean;
}

export const BoardCleaners: FC<BoardCleanersProps> = ({
  label,
  cleanersList = [],
  onClick,
  activeItem = '',
  isActive,
}) => {
  const handleClick = (cabinetId: string) => {
    onClick && onClick(cabinetId);
  };
  const content = () => (
    <div className={`expand-tools`}>
      {cleanersList.map((item) => (
        <div
          className={`cleaner-item ${activeItem === item.id ? 'active' : ''}`}
          key={item.id}
          onClick={item.disabled ? () => {} : () => handleClick(item.id)}>
          {item.icon}
        </div>
      ))}
    </div>
  );

  const t = useI18n();

  return (
    <Tooltip
      title={t(label)}
      placement="top"
      overlayClassName="translated-tooltip"
      mouseLeaveDelay={0}>
      <Popover
        overlayClassName="expand-tools-popover expand-tools-popover-board-cleaner"
        trigger="hover"
        content={content}
        placement="top">
        <div className="tool" onClick={() => handleClick('eraser')}>
          <SvgIcon
            type={SvgIconEnum.ERASER}
            colors={
              isActive
                ? {
                    iconPrimary: InteractionStateColors.allow,
                  }
                : {}
            }
            hoverType={SvgIconEnum.ERASER}
            hoverColors={{
              iconPrimary: InteractionStateColors.allow,
            }}
          />
          <SvgImg size={6} type={SvgIconEnum.TRIANGLE_DOWN} className="triangle-icon" />
          <span className="tool-label">{t(label)}</span>
        </div>
      </Popover>
    </Tooltip>
  );
};
