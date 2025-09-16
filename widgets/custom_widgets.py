"""
Custom Widgets for Modern Insurance Management System
Features elegant, animated widgets with modern styling
"""

from PySide6.QtWidgets import *
from PySide6.QtCore import *
from PySide6.QtGui import *
import math


class MetricCard(QFrame):
    """Modern metric display card with hover animations"""

    def __init__(self, title, value, trend=None, trend_value=None, icon=None):
        super().__init__()
        self.setObjectName("MetricCard")
        self.setProperty("class", "MetricCard")
        self.setCursor(Qt.PointingHandCursor)

        # Animation setup
        self.hover_animation = QPropertyAnimation(self, b"geometry")
        self.hover_animation.setDuration(200)
        self.hover_animation.setEasingCurve(QEasingCurve.OutCubic)

        self.setup_ui(title, value, trend, trend_value, icon)

    def setup_ui(self, title, value, trend, trend_value, icon):
        layout = QVBoxLayout(self)
        layout.setSpacing(8)
        layout.setContentsMargins(20, 20, 20, 20)

        # Header with icon and trend
        header_layout = QHBoxLayout()

        if icon:
            icon_label = QLabel(icon)
            icon_label.setAlignment(Qt.AlignLeft)
            header_layout.addWidget(icon_label)

        header_layout.addStretch()

        if trend and trend_value:
            trend_widget = self.create_trend_widget(trend, trend_value)
            header_layout.addWidget(trend_widget)

        if header_layout.count() > 0:
            layout.addLayout(header_layout)

        # Main value
        value_label = QLabel(str(value))
        value_label.setObjectName("MetricNumber")
        value_label.setProperty("class", "MetricNumber")
        value_label.setAlignment(Qt.AlignLeft)
        layout.addWidget(value_label)

        # Title
        title_label = QLabel(title)
        title_label.setObjectName("MetricLabel")
        title_label.setProperty("class", "MetricLabel")
        title_label.setAlignment(Qt.AlignLeft)
        layout.addWidget(title_label)

        layout.addStretch()

    def create_trend_widget(self, trend, value):
        trend_widget = QLabel()
        trend_widget.setObjectName("MetricTrend")

        if trend == "up":
            trend_widget.setText(f"↗ +{value}")
            trend_widget.setProperty("class", "MetricTrend TrendUp")
        elif trend == "down":
            trend_widget.setText(f"↘ -{value}")
            trend_widget.setProperty("class", "MetricTrend TrendDown")
        else:
            trend_widget.setText(f"→ {value}")
            trend_widget.setProperty("class", "MetricTrend TrendNeutral")

        return trend_widget

    def enterEvent(self, event):
        """Hover enter animation"""
        super().enterEvent(event)
        self.animate_scale(1.02)

    def leaveEvent(self, event):
        """Hover leave animation"""
        super().leaveEvent(event)
        self.animate_scale(1.0)

    def animate_scale(self, scale_factor):
        """Smooth scale animation"""
        # Simplified animation to avoid rendering issues
        if hasattr(self, '_scale_effect'):
            return

        self._scale_effect = QGraphicsOpacityEffect()
        self.setGraphicsEffect(self._scale_effect)

        self.scale_anim = QPropertyAnimation(self._scale_effect, b"opacity")
        self.scale_anim.setDuration(100)
        self.scale_anim.setStartValue(0.9)
        self.scale_anim.setEndValue(1.0)
        self.scale_anim.finished.connect(self.cleanup_scale_effect)
        self.scale_anim.start()

    def cleanup_scale_effect(self):
        """Clean up scale effect"""
        if hasattr(self, '_scale_effect'):
            self.setGraphicsEffect(None)
            delattr(self, '_scale_effect')


class AlertCard(QFrame):
    """Alert notification card with status indication"""

    def __init__(self, title, message, alert_type="info", action_text=None):
        super().__init__()
        self.setObjectName("AlertCard")
        self.setProperty("class", f"AlertCard {alert_type}")

        self.setup_ui(title, message, alert_type, action_text)

    def setup_ui(self, title, message, alert_type, action_text):
        layout = QVBoxLayout(self)
        layout.setContentsMargins(15, 15, 15, 15)
        layout.setSpacing(8)

        # Header
        header_layout = QHBoxLayout()

        # Status icon
        status_icon = self.get_status_icon(alert_type)
        icon_label = QLabel(status_icon)
        header_layout.addWidget(icon_label)

        # Title
        title_label = QLabel(title)
        title_label.setStyleSheet("font-weight: 600; color: #2C3E50;")
        header_layout.addWidget(title_label)

        header_layout.addStretch()
        layout.addLayout(header_layout)

        # Message
        message_label = QLabel(message)
        message_label.setWordWrap(True)
        message_label.setStyleSheet("color: #7F8C8D; font-size: 13px;")
        layout.addWidget(message_label)

        # Action button if provided
        if action_text:
            action_btn = QPushButton(action_text)
            action_btn.setProperty("class", "SecondaryButton")
            action_btn.setMaximumWidth(120)
            layout.addWidget(action_btn, alignment=Qt.AlignRight)

    def get_status_icon(self, alert_type):
        icons = {
            "urgent": "🔴",
            "warning": "🟡",
            "info": "🔵",
            "success": "🟢"
        }
        return icons.get(alert_type, "ℹ️")


class CustomTable(QTableWidget):
    """Enhanced table widget with modern styling and interactions"""

    def __init__(self, data=None, headers=None):
        super().__init__()
        self.setAlternatingRowColors(True)
        self.setSelectionBehavior(QAbstractItemView.SelectRows)
        self.setVerticalScrollMode(QAbstractItemView.ScrollPerPixel)
        self.setHorizontalScrollMode(QAbstractItemView.ScrollPerPixel)
        self.verticalHeader().setVisible(False)
        self.setShowGrid(False)

        if data and headers:
            self.populate_table(data, headers)

    def populate_table(self, data, headers):
        self.setRowCount(len(data))
        self.setColumnCount(len(headers))
        self.setHorizontalHeaderLabels(headers)

        for row, row_data in enumerate(data):
            for col, cell_data in enumerate(row_data):
                if col == len(row_data) - 1 and isinstance(cell_data, str) and cell_data in ['activa', 'pendiente', 'urgente', 'próximo']:
                    # Status column with colored labels
                    status_widget = self.create_status_widget(cell_data)
                    self.setCellWidget(row, col, status_widget)
                else:
                    item = QTableWidgetItem(str(cell_data))
                    item.setFlags(item.flags() & ~Qt.ItemIsEditable)
                    self.setItem(row, col, item)

        # Auto-adjust column widths
        self.resizeColumnsToContents()
        header = self.horizontalHeader()
        header.setStretchLastSection(True)

    def create_status_widget(self, status):
        """Create colored status label"""
        widget = QWidget()
        layout = QHBoxLayout(widget)
        layout.setContentsMargins(5, 5, 5, 5)

        label = QLabel(status.title())
        label.setProperty("class", f"StatusLabel Status{status.title()}")
        label.setAlignment(Qt.AlignCenter)

        if status == "activa":
            label.setProperty("class", "StatusLabel StatusActive")
        elif status == "pendiente":
            label.setProperty("class", "StatusLabel StatusPending")
        elif status in ["urgente", "próximo"]:
            label.setProperty("class", "StatusLabel StatusUrgent")

        layout.addWidget(label)
        return widget


class LoadingSpinner(QWidget):
    """Animated loading spinner"""

    def __init__(self, size=32):
        super().__init__()
        self.size = size
        self.angle = 0
        self.setFixedSize(size, size)

        # Animation timer
        self.timer = QTimer()
        self.timer.timeout.connect(self.rotate)

    def start_animation(self):
        self.timer.start(50)  # 20 FPS
        self.show()

    def stop_animation(self):
        self.timer.stop()
        self.hide()

    def rotate(self):
        self.angle = (self.angle + 10) % 360
        self.update()

    def paintEvent(self, event):
        painter = QPainter(self)
        painter.setRenderHint(QPainter.Antialiasing)

        # Draw spinning circle
        rect = QRect(0, 0, self.size, self.size)
        painter.translate(rect.center())
        painter.rotate(self.angle)

        # Draw arc
        pen = QPen(QColor("#D4AF37"), 3)
        pen.setCapStyle(Qt.RoundCap)
        painter.setPen(pen)

        arc_rect = QRect(-self.size//2 + 3, -self.size//2 + 3,
                        self.size - 6, self.size - 6)
        painter.drawArc(arc_rect, 0, 270 * 16)  # 270 degrees


class RippleButton(QPushButton):
    """Button with Material Design ripple effect"""

    def __init__(self, text="", parent=None):
        super().__init__(text, parent)
        self.ripple_radius = 0
        self.ripple_center = QPoint()
        self.ripple_animation = QPropertyAnimation(self, b"ripple_radius")
        self.ripple_animation.setDuration(300)
        self.ripple_animation.finished.connect(self.animation_finished)

    def mousePressEvent(self, event):
        super().mousePressEvent(event)
        self.start_ripple(event.pos())

    def start_ripple(self, center):
        self.ripple_center = center
        max_radius = max(self.width(), self.height())

        self.ripple_animation.setStartValue(0)
        self.ripple_animation.setEndValue(max_radius)
        self.ripple_animation.start()

    def animation_finished(self):
        self.ripple_radius = 0
        self.update()

    @Property(int)
    def ripple_radius(self):
        return self._ripple_radius

    @ripple_radius.setter
    def ripple_radius(self, value):
        self._ripple_radius = value
        self.update()

    def paintEvent(self, event):
        super().paintEvent(event)

        if self.ripple_radius > 0:
            painter = QPainter(self)
            painter.setRenderHint(QPainter.Antialiasing)
            painter.setClipRect(self.rect())

            # Draw ripple effect
            color = QColor("#FFFFFF")
            color.setAlpha(50)
            painter.setBrush(QBrush(color))
            painter.setPen(Qt.NoPen)

            painter.drawEllipse(
                self.ripple_center.x() - self.ripple_radius,
                self.ripple_center.y() - self.ripple_radius,
                2 * self.ripple_radius,
                2 * self.ripple_radius
            )


class SidebarButton(QPushButton):
    """Sidebar navigation button with modern styling"""

    def __init__(self, text, icon=None, parent=None):
        super().__init__(text, parent)
        self.setCheckable(True)
        self.setProperty("class", "SidebarItem")

        if icon:
            self.setText(f"{icon}  {text}")

        # Hover animation
        self.effect = QGraphicsColorizeEffect()
        self.setGraphicsEffect(self.effect)

        self.color_animation = QPropertyAnimation(self.effect, b"color")
        self.color_animation.setDuration(200)

    def enterEvent(self, event):
        super().enterEvent(event)
        if not self.isChecked():
            self.color_animation.setStartValue(QColor(0, 0, 0, 0))
            self.color_animation.setEndValue(QColor(244, 208, 63, 30))
            self.color_animation.start()

    def leaveEvent(self, event):
        super().leaveEvent(event)
        if not self.isChecked():
            self.color_animation.setStartValue(QColor(244, 208, 63, 30))
            self.color_animation.setEndValue(QColor(0, 0, 0, 0))
            self.color_animation.start()


class CustomLineEdit(QLineEdit):
    """Enhanced line edit with floating label effect"""

    def __init__(self, placeholder="", parent=None):
        super().__init__(parent)
        self.setProperty("class", "CustomLineEdit")
        self.setPlaceholderText(placeholder)

        # Focus animations
        self.focus_animation = QPropertyAnimation(self, b"minimumHeight")
        self.focus_animation.setDuration(200)

    def focusInEvent(self, event):
        super().focusInEvent(event)
        self.animate_focus(True)

    def focusOutEvent(self, event):
        super().focusOutEvent(event)
        self.animate_focus(False)

    def animate_focus(self, focused):
        start_height = 44 if focused else 46
        end_height = 46 if focused else 44

        self.focus_animation.setStartValue(start_height)
        self.focus_animation.setEndValue(end_height)
        self.focus_animation.start()


class NotificationToast(QWidget):
    """Toast notification widget"""

    def __init__(self, message, toast_type="info", duration=3000, parent=None):
        super().__init__(parent)
        self.setWindowFlags(Qt.FramelessWindowHint | Qt.WindowStaysOnTopHint)
        self.setAttribute(Qt.WA_TranslucentBackground)

        self.setup_ui(message, toast_type)
        self.setup_animations(duration)

    def setup_ui(self, message, toast_type):
        layout = QHBoxLayout(self)
        layout.setContentsMargins(20, 15, 20, 15)

        # Background with rounded corners
        self.setStyleSheet(f"""
            QWidget {{
                background-color: {"#27AE60" if toast_type == "success" else
                                  "#E74C3C" if toast_type == "error" else
                                  "#F39C12" if toast_type == "warning" else "#3498DB"};
                border-radius: 8px;
                color: white;
                font-weight: 500;
            }}
        """)

        # Icon
        icon_map = {
            "success": "✓",
            "error": "✗",
            "warning": "⚠",
            "info": "ℹ"
        }

        icon_label = QLabel(icon_map.get(toast_type, "ℹ"))
        icon_label.setStyleSheet("font-size: 16px; font-weight: bold;")
        layout.addWidget(icon_label)

        # Message
        message_label = QLabel(message)
        message_label.setWordWrap(True)
        layout.addWidget(message_label)

    def setup_animations(self, duration):
        # Slide in animation
        self.slide_animation = QPropertyAnimation(self, b"pos")
        self.slide_animation.setDuration(300)
        self.slide_animation.setEasingCurve(QEasingCurve.OutCubic)

        # Fade out animation
        self.fade_animation = QPropertyAnimation(self, b"windowOpacity")
        self.fade_animation.setDuration(300)
        self.fade_animation.finished.connect(self.hide)

        # Auto-hide timer
        self.hide_timer = QTimer()
        self.hide_timer.setSingleShot(True)
        self.hide_timer.timeout.connect(self.start_fade_out)
        self.hide_timer.start(duration)

    def show_toast(self, parent_widget):
        """Show toast notification positioned relative to parent"""
        if parent_widget:
            parent_rect = parent_widget.geometry()
            self.move(parent_rect.right() - self.width() - 20,
                     parent_rect.top() + 20)

        # Slide in from right
        start_pos = QPoint(self.x() + 300, self.y())
        end_pos = self.pos()

        self.move(start_pos)
        self.show()

        self.slide_animation.setStartValue(start_pos)
        self.slide_animation.setEndValue(end_pos)
        self.slide_animation.start()

    def start_fade_out(self):
        self.fade_animation.setStartValue(1.0)
        self.fade_animation.setEndValue(0.0)
        self.fade_animation.start()