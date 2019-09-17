import React, { Component } from 'react';
import { CountryDropdown } from 'react-country-region-selector';
import phone from 'phone';
import { Form, Input } from 'antd';

import './styles.css';

export default class InputPhoneNumber extends Component {
	initialState = { code: 'PH', localValue: '', isFocused: false };
	state = { ...this.initialState, initialState: this.initialState };

	static getDerivedStateFromProps(nextProps, prevState) {
		// Set initial localValue
		if (nextProps.value && !prevState.localValue) {
			return { ...prevState, localValue: nextProps.value };
		}

		// Resets equivalent value
		if (prevState.localValue !== nextProps.value) {
			// For Add
			if (typeof nextProps.value === 'undefined' && !prevState.isFocused) {
				return { ...prevState.initialState };
			}

			// For Edit
			if (!prevState.isFocused) {
				return { ...prevState.initialState, localValue: nextProps.value };
			}
		}

		return null;
	}

	getPhoneNumber = (value, code) => {
		const mobile = phone(value, code);
		return mobile.length ? mobile[0] : value;
	};

	handleChange = value => {
		this.setState({ localValue: value });
	};

	renderInput() {
		const { code } = this.state;
		const {
			disabled = false,
			id,
			label = '',
			onChange,
			placeholder = '',
			required = false,
			styles = {},
			value = ''
		} = this.props;

		return (
			<div class="row">
				<div class="col-md-2 col-sm-2 col-2">
					<CountryDropdown
						classes="form-control"
						disabled={disabled}
						onChange={e => this.setState({ code: e })}
						required={required}
						value={code}
						valueType="short"
					/>
				</div>
				<div class="col-md-10 col-sm-8 col-10">
					<Input
						allowClear
						autoComplete="off"
						disabled={disabled}
						name={id}
						placeholder={placeholder || label || id}
						required={required}
						size="large"
						style={styles}
						type="text"
						onBlur={e => {
							const mobile = this.getPhoneNumber(e.target.value, code);
							if (mobile != value) onChange(id, this.state.localValue);

							this.setState({ isFocused: false });
						}}
						onChange={e => {
							const mobile = this.getPhoneNumber(e.target.value, code);
							if (this.state.localValue != '' && e.target.value == '') onChange(id, mobile);
							this.handleChange(mobile);
						}}
						onFocus={e => {
							this.setState({ isFocused: true });
						}}
						onPressEnter={e => {
							onChange(id, this.getPhoneNumber(e.target.value, code));
							return true;
						}}
						value={this.state.localValue || ''}
					/>
				</div>
			</div>
		);
	}

	render() {
		const { label = '', required = false, withLabel = false } = this.props;

		const formItemCommonProps = {
			colon: false,
			label: withLabel ? label : false,
			required
		};

		return <Form.Item {...formItemCommonProps}>{this.renderInput()}</Form.Item>;
	}
}
