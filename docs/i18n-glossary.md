# 中英双语方案与术语表

2026-10-09 起，站点要做成**中文 / English 两个独立版本**。

## 规则（项目方已确认）

1. **两个独立版本，不混排**：不采用「每段中文下面跟一段英文」的写法；同一页只出现一种语言的正文。
2. **英文版不出现任何中文**（专有名词除外：`REVERIE`、`UNSEEN BOX`、`REVERIE SHOP`、`REALMVIEW`、`SHANGHAI` 等）。
3. **中文版保持现有的编辑感混排**（等宽英文眉题 + 中文正文，例如 `EDITOR'S PICKS / 演示活动`）。
4. **切换入口**：页头中间、国家城市选择器右侧的语言图标（🌐 + 当前语言），点开为小面板选择 `中文 / English`；选择立即生效并保存在本机（`unseen:locale:v1`），`<html lang>` 同步为 `zh-CN` / `en`。
5. 内容按页面逐个确认后落地，未确认的页面在英文版下仍显示中文（阶段性状态，见文末进度表）。

## 技术实现

- `src/i18n/messages.ts`：`Locale` / `Localized` 类型、`locales` 选项、`localeStorageKey`、`loadLocale()`。
- `src/i18n/context.ts`：`LocaleContext`。
- `src/i18n/locale.tsx`：`LocaleProvider`（写入 localStorage、同步 `<html lang>`）。
- `src/i18n/use-locale.ts`：`useLocale()`，返回 `{ locale, setLocale, t }`；`t({ zh, en })` 取当前语言的值。
- `src/i18n/shell.ts`：外壳文案（导航 aria-label、MORE 菜单、国家城市选择器、语言选择器本身）。
- 组件与数据按需改造为 `Localized`：中文版取 `zh`、英文版取 `en`；页面内容按页面分批迁移。

## 术语表（待项目方逐条确认）

> 表格里的英文是建议稿；`待定` 表示需要项目方给一个说法。确认后即为全站统一用法。

### 品牌与体系

| 中文 | 建议英文 | 备注 |
| --- | --- | --- |
| 异想集 | REVERIE | 已确认过的英文名，保留 |
| 暗盒 | UNSEEN BOX | 同上 |
| 异想商店 | REVERIE SHOP | 同上 |
| 域见 | REALMVIEW | 同上 |
| 梦游仙境（本期主题） | WONDERLAND | 现数据里是 `REVERIE ｜in the WONDERLAND`，英文版建议只留 `WONDERLAND` 或 `REVERIE in the WONDERLAND`，**待定** |
| 异想集 REVERIE｜IN THE WONDERLAND（系列名） | REVERIE｜IN THE WONDERLAND | 本身已是英文 |
| 异想集（活动/策展/社群） | Experience | ABOUT 里的四分工之一 |
| 暗盒（内容/观察/推荐） | Content | 同上 |
| 异想商店（选品/原创/联名） | Commerce | 同上 |
| 域见（品牌/营销/商业服务） | Services | 同上 |

### 导航与外壳

| 中文 | 建议英文 | 备注 |
| --- | --- | --- |
| DISCOVER / HOME / IDENTITY | 同左 | 已英文 |
| COLLABORATE / ABOUT | 同左 | 已英文 |
| EXPLORE / CONTENT / EVENTS / SHOP / SPACE | 同左 | 已英文 |
| 更多（MORE 菜单） | MORE | MORE 菜单外壳已双语 |
| 选择语言 / 当前语言 | Choose language / Current language | 已双语 |
| 选择国家地区 / 你要从哪里开始？ | SELECT REGION / Where are you? | 已双语 |
| 中文 / English | 同左 | 语言名保留各自写法 |
| 回到页首 | Back to top | |

### 通用操作

| 中文 | 建议英文 |
| --- | --- |
| 查看详情 / 看作品 / 查看更多 | View details / See the piece / See more |
| 加入购物袋 / 加入购物车 | Add to bag / Add to cart |
| 加入小队 / 退出小队 | Join the squad / Leave the squad |
| 预约参观意向 / 预约时段 | Visit intent / Reserve a time slot |
| 清除筛选 / 清除偏好 | Clear filters / Clear preferences |
| 去发布 / 完成方式 | Publish / How to finish |
| 下载票据图片 | Download ticket image |
| 取消票据 / 联系客服 | Cancel ticket / Contact support |
| 模拟下单 / 继续逛集市 | Place demo order / Keep browsing |
| 回到集市 | Back to the shop |

### 筛选与分类

| 中文 | 建议英文 |
| --- | --- |
| 兴趣方向 / 可用时长 / 出行方式 | Interest / Time available / Company |
| 都可以 / 暂不限定 | Any |
| 城市漫游 / 动手创作 / 聆听时刻 | City wander / Hands-on / Listening |
| 适合独自出发 / 想认识同行者 | Going solo / Meeting people |
| 独立创作者产品 / 艺术家周边 / 海外小众商品 / 自有原创产品 | Independent creators / Artist merch / Niche imports / REVERIE originals |
| 活动上的品牌 / UNSEEN 发现的品牌（历史分类） | Event brands / UNSEEN finds |
| 全部 | All |

### 演示标注（重要：英文版必须同样标清演示属性）

| 中文 | 建议英文 |
| --- | --- |
| 演示 / 演示数据 | Demo / Demo data |
| 虚构演示内容 | Fictional demo content |
| 待项目方提供 | To be provided |
| 占位 / 占位素材 | Placeholder |
| 不接入真实支付 | No real payment is involved |
| 仅本地保存 | Stored on this device only |
| 小队 / 同行者 | Squad / Companions（**待定**：也可用 crew / teammates） |
| 活动 / 现场 | Event / On site |
| 空间 / 到访意向 | Space / Visit intent |
| 票据 / 票夹 / 票号 | Ticket / Ticket wallet / Ticket number |

## 逐页确认进度

| 范围 | 状态 | 说明 |
| --- | --- | --- |
| 外壳（页头 / 主导航 / 手机底栏 / MORE 菜单 / 国家城市选择器 / 语言选择器） | ✅ 已双语并验证 | E51 |
| DISCOVER（月度主题页） | ⬜ 待确认英文稿 | 内容最多（主题、活动表、目录、测试、任务、商店入口） |
| HOME 页头与五个栏目标签 | ⬜ 待确认 | 页头大标题「在现场，遇见更多。」等 |
| HOME › EXPLORE | ⬜ 待确认 | 偏好筛选、三条计划、四处栏目引导 |
| HOME › CONTENT | ⬜ 待确认 | 标题、四个形式、九条专题 |
| HOME › EVENTS | ⬜ 待确认 | 定位说明、形式标签、四个活动、小队 |
| HOME › SHOP | ⬜ 待确认 | 说明、八个商品、购物袋与下单流程 |
| HOME › SPACE | ⬜ 待确认 | 三个空间、预约流程 |
| IDENTITY | ⬜ 待确认 | 护照、徽章、记录表单、票据夹 |
| COLLABORATE | ⬜ 待确认 | 定位、招募、身份选择、报名表单 |
| ABOUT | ⬜ 待确认 | 一句话定义、四个品牌、数据、联系方式 |
| 票据图片（canvas 绘制） | ⬜ 待确认 | 票面文字需要英文版 |
