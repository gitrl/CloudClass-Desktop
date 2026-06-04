import React, { FC } from 'react';
import { Popover } from '../popover';
import { Tooltip } from '../tooltip';
import { ToolItem } from './tool';
import { SvgImg, SvgIcon, SvgIconEnum } from '../svg-img';
import { InteractionStateColors } from '../../utilities/state-color';
import { useI18n } from 'agora-common-libs';

export interface SliceItem {
  id: string;
  icon: React.ReactElement;
  name: string;
  disabled?: boolean;
}

export interface SliceProps extends ToolItem {
  slicersList: SliceItem[];
  onClick?: (value: string) => void;
  hover?: boolean;
}

export const Slice: FC<SliceProps> = ({ label, slicersList = [], onClick }) => {
  const handleClick = (cabinetId: string) => {
    onClick && onClick(cabinetId);
  };
  const content = () => (
    <div className={`expand-tools`}>
      {slicersList.map((item) => (
        <div
          className={`slice-item`}
          key={item.id}
          onClick={item.disabled ? () => {} : () => handleClick(item.id)}>
          <div className="slice-item-icon">{item.icon}</div>
          {item.name}
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
        <div className="tool">
          <SvgIcon
            type={SvgIconEnum.SLICE}
            hoverType={SvgIconEnum.SLICE}
            hoverColors={{ iconPrimary: InteractionStateColors.allow }}
          />
          <SvgImg size={6} type={SvgIconEnum.TRIANGLE_DOWN} className="triangle-icon" />
          <span className="tool-label">{t(label)}</span>
        </div>
      </Popover>
    </Tooltip>
  );
};
