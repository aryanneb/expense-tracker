import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './Chart.css'; 

ChartJS.register(ArcElement, Tooltip, Legend);

const ChartComponent = ({ expenses }) => {
    const uniqueCategories = Array.from(
        new Set(expenses.map((expense) => expense.category))
    );

    const categoryTotals = uniqueCategories.map((category) => {
        return {
            category,
            total: expenses
                .filter((expense) => expense.category === category)
                .reduce((sum, expense) => sum + Number(expense.amount), 0),
        };
    });

    const totalSpent = categoryTotals.reduce((sum, cat) => sum + cat.total, 0);

    const chartData = {
        labels: categoryTotals.map((cat) => cat.category),
        datasets: [
            {
                data: categoryTotals.map((cat) =>
                    ((cat.total / totalSpent) * 100).toFixed(2)
                ),
                backgroundColor: [
                    "#36A2EB",
                    "#FF6384",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                    "#FF9F40",
                ],
                hoverBackgroundColor: [
                    "#36A2EB",
                    "#FF6384",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                    "#FF9F40",
                ],
            },
        ],
    };

    const options = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            tooltip: {
                backgroundColor: '#333',
                titleColor: '#fff',
                bodyColor: '#fff',
                callbacks: {
                    label: function (tooltipItem) {
                        const category = tooltipItem.label;
                        const expensesInCategory = expenses
                            .filter(expense => expense.category === category)
                            .map(expense => `${expense.description} - $${Number(expense.amount).toFixed(2)} - ${new Date(expense.date).toLocaleDateString()}`);
                        return expensesInCategory;
                    }
                }
            },
            legend: {
                position: 'top',
                labels: {
                    color: '#fff'
                }
            },
        },
    };

    return (
        <div className="chart-container">
            <h2>Spending by Category</h2>
            <div style={{ position: "relative", height: "50vh" }}>
                <Doughnut data={chartData} options={options} />
            </div>
        </div>
    );
};

export default ChartComponent;
