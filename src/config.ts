/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2022-03-19 18:51:32
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 亮调配置
 *****************************************
 */
export const light = {
    '--color': '#222222',
    '--background-color': '#f1f1f7',
    '--primary-color': '#1890ff',
    '--primary-color-hover': '#40a9ff',
    '--primary-color-active': '#096dd9',
    '--primary-color-outline': 'rgba(24, 144, 255, .2)',
    '--success-color': '#52c41a',
    '--success-color-hover': '#73d13d',
    '--success-color-active': '#389e0d',
    '--success-color-outline': 'rgba(82, 196, 26, .2)',
    '--error-color': '#ff4d4f',
    '--error-color-hover': '#ff7875',
    '--error-color-active': '#d9363e',
    '--error-color-outline': 'rgba(255, 77, 79, .2)',
    '--warning-color': '#faad14',
    '--warning-color-hover': '#ffc53d',
    '--warning-color-active': '#d48806',
    '--warning-color-outline': 'rgba(250, 173, 20, .2)'
};


/**
 *****************************************
 * 暗调配置
 *****************************************
 */
export const dark = {
    '--color': '#bdc1c6',
    '--background-color': '#202124',
    '--primary-color': '#177ddc',
    '--primary-color-hover': '#1765ad',
    '--primary-color-active': '#3993dc',
    '--primary-color-outline': 'rgba(24, 144, 255, .2)',
    '--success-color': '#49aa19',
    '--success-color-hover': '#3c8618',
    '--success-color-active': '#67b839',
    '--success-color-outline': 'rgba(82, 196, 26, .2)',
    '--error-color': '#a61d24',
    '--error-color-hover': '#800f19',
    '--error-color-active': '#b33b3d',
    '--error-color-outline': 'rgba(255, 77, 79, .2)',
    '--warning-color': '#d89614',
    '--warning-color-hover': '#b37407',
    '--warning-color-active': '#e6b239',
    '--warning-color-outline': 'rgba(250, 173, 20, .2)'
};


/**
 *****************************************
 * 默认配置
 *****************************************
 */
export default {

    // layout
    '--font-size': '16px',
    '--border-color': 'hsv(0, 0, 85%)',
    '--border-radius': '2px',

    // animation
    '--ease-base-out': 'cubic-bezier(0.7, 0.3, 0.1, 1)',
    '--ease-base-in': 'cubic-bezier(0.9, 0, 0.3, 0.7)',
    '--ease-out': 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    '--ease-in': 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    '--ease-in-out': 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    '--ease-out-back': 'cubic-bezier(0.12, 0.4, 0.29, 1.46)',
    '--ease-in-back': 'cubic-bezier(0.71, -0.46, 0.88, 0.6)',
    '--ease-in-out-back': 'cubic-bezier(0.71, -0.46, 0.29, 1.46)',
    '--ease-out-circ': 'cubic-bezier(0.08, 0.82, 0.17, 1)',
    '--ease-in-circ': 'cubic-bezier(0.6, 0.04, 0.98, 0.34)',
    '--ease-in-out-circ': 'cubic-bezier(0.78, 0.14, 0.15, 0.86)',
    '--ease-out-quint': 'cubic-bezier(0.23, 1, 0.32, 1)',
    '--ease-in-quint': 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
    '--ease-in-out-quint': 'cubic-bezier(0.86, 0, 0.07, 1)',
};
