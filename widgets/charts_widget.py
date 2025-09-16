"""
Charts Widget for Modern Insurance Management System
Custom chart implementations using QPainter for elegant data visualization
"""

from PySide6.QtWidgets import *
from PySide6.QtCore import *
from PySide6.QtGui import *
import math
import random


class BarChart(QWidget):
    """Modern animated bar chart widget"""

    def __init__(self, data=None, title="Chart", parent=None):
        super().__init__(parent)
        self.data = data or []
        self.title = title
        self.bar_heights = [0] * len(self.data)
        self.animation_progress = 0

        self.setMinimumSize(400, 300)

        # Animation setup
        self.animation = QPropertyAnimation(self, b"animation_progress")
        self.animation.setDuration(1500)
        self.animation.setEasingCurve(QEasingCurve.OutCubic)
        self.animation.valueChanged.connect(self.update_bars)

        # Start animation after widget is shown
        QTimer.singleShot(100, self.start_animation)

    def start_animation(self):
        """Start the chart animation"""
        self.animation.setStartValue(0)
        self.animation.setEndValue(1)
        self.animation.start()

    @Property(float)
    def animation_progress(self):
        return self._animation_progress

    @animation_progress.setter
    def animation_progress(self, value):
        self._animation_progress = value
        self.update()

    def update_bars(self):
        """Update bar heights based on animation progress"""
        if not self.data:
            return

        for i, (_, value) in enumerate(self.data):
            target_height = value
            self.bar_heights[i] = target_height * self._animation_progress

    def paintEvent(self, event):
        painter = QPainter(self)
        painter.setRenderHint(QPainter.Antialiasing)

        rect = self.rect()
        margin = 40
        chart_rect = rect.adjusted(margin, margin, -margin, -margin)

        # Background
        painter.fillRect(rect, QColor("#FFFFFF"))

        # Title
        painter.setPen(QColor("#1B4F72"))
        font = QFont("Segoe UI", 16, QFont.Bold)
        painter.setFont(font)
        title_rect = QRect(rect.x(), rect.y(), rect.width(), margin)
        painter.drawText(title_rect, Qt.AlignCenter, self.title)

        if not self.data:
            return

        # Chart area
        bar_width = chart_rect.width() / len(self.data) * 0.7
        bar_spacing = chart_rect.width() / len(self.data) * 0.3

        max_value = max(value for _, value in self.data) if self.data else 1

        for i, (label, value) in enumerate(self.data):
            # Calculate bar position and height
            x = chart_rect.x() + i * (bar_width + bar_spacing) + bar_spacing / 2
            bar_height = (self.bar_heights[i] / max_value) * chart_rect.height() * 0.8
            y = chart_rect.bottom() - bar_height

            # Draw bar with gradient
            bar_rect = QRectF(x, y, bar_width, bar_height)

            gradient = QLinearGradient(0, y, 0, y + bar_height)
            gradient.setColorAt(0, QColor("#F4D03F"))
            gradient.setColorAt(1, QColor("#D4AF37"))

            painter.setBrush(QBrush(gradient))
            painter.setPen(Qt.NoPen)
            painter.drawRoundedRect(bar_rect, 4, 4)

            # Draw value on top of bar
            if bar_height > 20:
                painter.setPen(QColor("#1B4F72"))
                font = QFont("Segoe UI", 10, QFont.Bold)
                painter.setFont(font)
                value_rect = QRectF(x, y - 20, bar_width, 15)
                painter.drawText(value_rect, Qt.AlignCenter, f"${value:,.0f}")

            # Draw label below bar
            painter.setPen(QColor("#7F8C8D"))
            font = QFont("Segoe UI", 9)
            painter.setFont(font)
            label_rect = QRectF(x, chart_rect.bottom() + 5, bar_width, 15)
            painter.drawText(label_rect, Qt.AlignCenter, label)


class LineChart(QWidget):
    """Modern animated line chart widget"""

    def __init__(self, data=None, title="Line Chart", parent=None):
        super().__init__(parent)
        self.data = data or []
        self.title = title
        self.animation_progress = 0

        self.setMinimumSize(400, 300)

        # Animation setup
        self.animation = QPropertyAnimation(self, b"animation_progress")
        self.animation.setDuration(2000)
        self.animation.setEasingCurve(QEasingCurve.OutCubic)

        QTimer.singleShot(100, self.start_animation)

    def start_animation(self):
        self.animation.setStartValue(0)
        self.animation.setEndValue(1)
        self.animation.start()

    @Property(float)
    def animation_progress(self):
        return self._animation_progress

    @animation_progress.setter
    def animation_progress(self, value):
        self._animation_progress = value
        self.update()

    def paintEvent(self, event):
        painter = QPainter(self)
        painter.setRenderHint(QPainter.Antialiasing)

        rect = self.rect()
        margin = 40
        chart_rect = rect.adjusted(margin, margin, -margin, -margin)

        # Background
        painter.fillRect(rect, QColor("#FFFFFF"))

        # Title
        painter.setPen(QColor("#1B4F72"))
        font = QFont("Segoe UI", 16, QFont.Bold)
        painter.setFont(font)
        title_rect = QRect(rect.x(), rect.y(), rect.width(), margin)
        painter.drawText(title_rect, Qt.AlignCenter, self.title)

        if not self.data or len(self.data) < 2:
            return

        # Calculate points
        max_value = max(value for _, value in self.data)
        min_value = min(value for _, value in self.data)
        value_range = max_value - min_value if max_value != min_value else 1

        points = []
        for i, (label, value) in enumerate(self.data):
            x = chart_rect.x() + (i / (len(self.data) - 1)) * chart_rect.width()
            y = chart_rect.bottom() - ((value - min_value) / value_range) * chart_rect.height() * 0.8
            points.append(QPointF(x, y))

        # Draw grid lines
        painter.setPen(QPen(QColor("#F0F0F0"), 1))
        for i in range(5):
            y = chart_rect.y() + (i / 4) * chart_rect.height()
            painter.drawLine(chart_rect.x(), y, chart_rect.right(), y)

        # Draw animated line
        if self.animation_progress > 0:
            visible_points = int(len(points) * self.animation_progress)
            if visible_points > 1:
                # Draw line segments
                painter.setPen(QPen(QColor("#D4AF37"), 3))
                for i in range(visible_points - 1):
                    painter.drawLine(points[i], points[i + 1])

                # Draw points
                painter.setBrush(QBrush(QColor("#1B4F72")))
                painter.setPen(QPen(QColor("#FFFFFF"), 2))
                for i in range(visible_points):
                    painter.drawEllipse(points[i], 4, 4)

        # Draw labels
        painter.setPen(QColor("#7F8C8D"))
        font = QFont("Segoe UI", 9)
        painter.setFont(font)
        for i, (label, value) in enumerate(self.data):
            if i < len(points):
                label_rect = QRectF(points[i].x() - 30, chart_rect.bottom() + 5, 60, 15)
                painter.drawText(label_rect, Qt.AlignCenter, label)


class PieChart(QWidget):
    """Modern animated pie chart widget"""

    def __init__(self, data=None, title="Pie Chart", parent=None):
        super().__init__(parent)
        self.data = data or []
        self.title = title
        self.animation_progress = 0

        self.setMinimumSize(350, 350)

        # Colors for pie slices
        self.colors = [
            QColor("#F4D03F"), QColor("#D4AF37"), QColor("#2E86AB"),
            QColor("#1B4F72"), QColor("#E74C3C"), QColor("#27AE60"),
            QColor("#F39C12"), QColor("#9B59B6")
        ]

        # Animation setup
        self.animation = QPropertyAnimation(self, b"animation_progress")
        self.animation.setDuration(1500)
        self.animation.setEasingCurve(QEasingCurve.OutCubic)

        QTimer.singleShot(100, self.start_animation)

    def start_animation(self):
        self.animation.setStartValue(0)
        self.animation.setEndValue(1)
        self.animation.start()

    @Property(float)
    def animation_progress(self):
        return self._animation_progress

    @animation_progress.setter
    def animation_progress(self, value):
        self._animation_progress = value
        self.update()

    def paintEvent(self, event):
        painter = QPainter(self)
        painter.setRenderHint(QPainter.Antialiasing)

        rect = self.rect()

        # Background
        painter.fillRect(rect, QColor("#FFFFFF"))

        # Title
        painter.setPen(QColor("#1B4F72"))
        font = QFont("Segoe UI", 16, QFont.Bold)
        painter.setFont(font)
        title_rect = QRect(rect.x(), rect.y(), rect.width(), 40)
        painter.drawText(title_rect, Qt.AlignCenter, self.title)

        if not self.data:
            return

        # Chart area
        chart_size = min(rect.width(), rect.height() - 60) - 40
        chart_rect = QRect(
            rect.center().x() - chart_size // 2,
            rect.center().y() - chart_size // 2 + 20,
            chart_size,
            chart_size
        )

        # Calculate total value
        total_value = sum(value for _, value in self.data)
        if total_value == 0:
            return

        # Draw pie slices
        start_angle = 0
        for i, (label, value) in enumerate(self.data):
            span_angle = int((value / total_value) * 360 * 16 * self.animation_progress)

            if span_angle > 0:
                color = self.colors[i % len(self.colors)]
                painter.setBrush(QBrush(color))
                painter.setPen(QPen(QColor("#FFFFFF"), 2))

                painter.drawPie(chart_rect, start_angle, span_angle)

                # Draw percentage label
                if span_angle > 15 * 16:  # Only show label if slice is large enough
                    angle_mid = start_angle + span_angle / 2
                    angle_rad = (angle_mid / 16) * math.pi / 180

                    label_radius = chart_size * 0.35
                    label_x = chart_rect.center().x() + label_radius * math.cos(angle_rad)
                    label_y = chart_rect.center().y() + label_radius * math.sin(angle_rad)

                    painter.setPen(QColor("#FFFFFF"))
                    font = QFont("Segoe UI", 10, QFont.Bold)
                    painter.setFont(font)

                    percentage = (value / total_value) * 100
                    painter.drawText(QPointF(label_x - 15, label_y), f"{percentage:.1f}%")

                start_angle += span_angle

        # Draw legend
        self.draw_legend(painter, rect)

    def draw_legend(self, painter, rect):
        """Draw chart legend"""
        legend_x = rect.right() - 150
        legend_y = rect.center().y() - (len(self.data) * 25) // 2

        painter.setPen(QColor("#2C3E50"))
        font = QFont("Segoe UI", 10)
        painter.setFont(font)

        for i, (label, value) in enumerate(self.data):
            y = legend_y + i * 25

            # Color square
            color = self.colors[i % len(self.colors)]
            painter.fillRect(legend_x, y, 15, 15, color)

            # Label
            painter.drawText(legend_x + 25, y + 12, f"{label}: {value}")


class MetricsOverviewWidget(QWidget):
    """Combined widget showing multiple chart types"""

    def __init__(self, parent=None):
        super().__init__(parent)
        self.setup_ui()
        self.load_sample_data()

    def setup_ui(self):
        layout = QVBoxLayout(self)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(20)

        # Charts container
        charts_widget = QWidget()
        charts_layout = QHBoxLayout(charts_widget)
        charts_layout.setSpacing(20)

        # Bar chart for monthly revenue
        self.bar_chart = BarChart(title="Ingresos Mensuales")
        charts_layout.addWidget(self.bar_chart)

        # Pie chart for policy types
        self.pie_chart = PieChart(title="Tipos de Pólizas")
        charts_layout.addWidget(self.pie_chart)

        layout.addWidget(charts_widget)

    def load_sample_data(self):
        """Load sample data for demonstration"""
        # Monthly revenue data
        monthly_data = [
            ("Ene", 45000),
            ("Feb", 52000),
            ("Mar", 48000),
            ("Abr", 55000),
            ("May", 62000),
            ("Jun", 58000)
        ]
        self.bar_chart.data = monthly_data

        # Policy types data
        policy_data = [
            ("Auto", 125),
            ("Vida", 78),
            ("Hogar", 42),
            ("Salud", 35),
            ("Otros", 23)
        ]
        self.pie_chart.data = policy_data

    def refresh_data(self):
        """Refresh charts with new data"""
        self.bar_chart.start_animation()
        self.pie_chart.start_animation()


class MiniChart(QWidget):
    """Small chart widget for metric cards"""

    def __init__(self, data=None, chart_type="line", parent=None):
        super().__init__(parent)
        self.data = data or []
        self.chart_type = chart_type
        self.setFixedSize(80, 40)

    def paintEvent(self, event):
        painter = QPainter(self)
        painter.setRenderHint(QPainter.Antialiasing)

        rect = self.rect()

        if not self.data:
            return

        if self.chart_type == "line":
            self.draw_mini_line(painter, rect)
        elif self.chart_type == "bar":
            self.draw_mini_bars(painter, rect)

    def draw_mini_line(self, painter, rect):
        """Draw mini line chart"""
        if len(self.data) < 2:
            return

        max_val = max(self.data)
        min_val = min(self.data)
        val_range = max_val - min_val if max_val != min_val else 1

        points = []
        for i, value in enumerate(self.data):
            x = rect.x() + (i / (len(self.data) - 1)) * rect.width()
            y = rect.bottom() - ((value - min_val) / val_range) * rect.height()
            points.append(QPointF(x, y))

        # Draw line
        painter.setPen(QPen(QColor("#D4AF37"), 2))
        for i in range(len(points) - 1):
            painter.drawLine(points[i], points[i + 1])

    def draw_mini_bars(self, painter, rect):
        """Draw mini bar chart"""
        if not self.data:
            return

        bar_width = rect.width() / len(self.data) * 0.8
        spacing = rect.width() / len(self.data) * 0.2
        max_val = max(self.data)

        for i, value in enumerate(self.data):
            x = rect.x() + i * (bar_width + spacing)
            bar_height = (value / max_val) * rect.height()
            y = rect.bottom() - bar_height

            painter.fillRect(QRectF(x, y, bar_width, bar_height),
                           QColor("#D4AF37"))