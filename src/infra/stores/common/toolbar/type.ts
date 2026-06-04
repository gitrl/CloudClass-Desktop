export enum ToolbarItemCategory {
  PenPicker,
  ColorPicker,
  Cabinet,
  Eraser,
  Slice,
  Roster,
  Text,
  Clicker,
  Selector,
  CloudStorage,
  Save,
  Hand,
  // 从 cabinet popover 拍平上来的工具（屏幕共享/分组/激光笔/白板/计时器等）
  CabinetItem,
}

export enum CabinetItemEnum {
  ScreenShare = 'screenShare',
  BreakoutRoom = 'breakoutRoom',
  Laser = 'laser',
  Whiteboard = 'whiteboard',
  VideoGallery = 'videoGallery',
}

export interface CabinetItem {
  id: string;
  name: string;
  iconType?: string;
}

export class ToolbarItem {
  static fromData(data: {
    value: string;
    label: string;
    icon: string;
    category: ToolbarItemCategory;
    className?: string;
  }) {
    return new ToolbarItem(data.icon, data.value, data.label, data.category, data.className);
  }

  value: string;
  label: string;
  icon: string;
  category: ToolbarItemCategory;
  className?: string;

  constructor(
    icon: string,
    value: string,
    label: string,
    category: ToolbarItemCategory,
    className?: string,
  ) {
    this.value = value;
    this.label = label;
    this.icon = icon;
    this.category = category;
    this.className = className;
  }
}

export enum ScreenShareRoleType {
  Teacher = 'teacher',
  Student = 'student',
}
