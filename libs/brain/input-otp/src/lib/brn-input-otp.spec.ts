import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import type { InputMode } from './brn-input-otp';
import { BrnInputOtp } from './brn-input-otp';
import { BrnInputOtpSlot } from './brn-input-otp-slot';

describe('BrnInputOtp', () => {
	const setup = async (
		options: {
			maxLength?: number;
			disabled?: boolean;
			inputMode?: InputMode;
			inputId?: string;
			inputAutocomplete?: string;
			autofocus?: boolean;
		} = {},
	) => {
		const {
			maxLength = 6,
			disabled = false,
			inputMode = 'numeric',
			inputId,
			inputAutocomplete = 'one-time-code',
			autofocus = false,
		} = options;

		let template = `
      <brn-input-otp
        [maxLength]="${maxLength}"
        data-testid="brnInputOtp"
        ${disabled ? 'disabled' : ''}
        [inputMode]="'${inputMode}'"
        [autofocus]="${autofocus}"
        [inputAutocomplete]="'${inputAutocomplete}'"
        ${inputId ? `inputId="${inputId}"` : ''}
      >
    `;

		for (let i = 0; i < maxLength; i++) {
			template += `
        <brn-input-otp-slot [index]="${i}" data-testid="slot-${i}">
          <div data-testid="caret-${i}" class="caret">|</div>
        </brn-input-otp-slot>
      `;
		}

		template += `</brn-input-otp>`;

		const container = await render(template, {
			imports: [BrnInputOtp, BrnInputOtpSlot],
		});

		const input = container.container.querySelector('input[data-slot="input-otp"]') as HTMLInputElement;

		return {
			user: userEvent.setup(),
			container,
			input,
			containerElement: screen.getByTestId('brnInputOtp'),
			getSlot: (index: number) => screen.getByTestId(`slot-${index}`),
			getCaret: (index: number) => screen.queryByTestId(`caret-${index}`),
		};
	};

	describe('rendering', () => {
		it('renders with correct number of slots', async () => {
			await setup({ maxLength: 6 });

			for (let i = 0; i < 6; i++) {
				expect(screen.getByTestId(`slot-${i}`)).toBeInTheDocument();
			}
		});

		it('renders input with correct attributes', async () => {
			const { input } = await setup({ maxLength: 6, inputMode: 'tel', inputId: 'custom-id', inputAutocomplete: 'off' });

			expect(input).toBeInTheDocument();
			expect(input).toHaveAttribute('id', 'custom-id');
			expect(input).toHaveAttribute('autocomplete', 'off');
			expect(input).toHaveAttribute('data-slot', 'input-otp');
			expect(input).toHaveAttribute('inputMode', 'tel');
		});

		it('renders with default input mode numeric', async () => {
			const { input } = await setup({ maxLength: 6 });

			expect(input).toHaveAttribute('inputMode', 'numeric');
		});
	});

	describe('input behavior', () => {
		it('starts empty', async () => {
			const { input } = await setup({ maxLength: 6 });

			expect(input.value).toBe('');
		});

		it('accepts typed input up to maxLength', async () => {
			const { user, input } = await setup({ maxLength: 6 });

			await user.click(input);
			await user.keyboard('123456');

			expect(input.value).toBe('123456');
		});

		it('displays characters in slots', async () => {
			const { user, input, getSlot } = await setup({ maxLength: 4 });

			await user.click(input);
			await user.keyboard('1234');

			expect(getSlot(0)).toHaveTextContent('1');
			expect(getSlot(1)).toHaveTextContent('2');
			expect(getSlot(2)).toHaveTextContent('3');
			expect(getSlot(3)).toHaveTextContent('4');
		});

		it('enforces maxLength', async () => {
			const { user, input } = await setup({ maxLength: 4 });

			await user.click(input);
			await user.keyboard('123456789');

			expect(input.value).toBe('1239');
		});

		it('replaces last character when exceeding maxLength', async () => {
			const { user, input } = await setup({ maxLength: 4 });

			await user.click(input);
			await user.keyboard('1234');
			expect(input.value).toBe('1234');

			await user.keyboard('5');
			expect(input.value).toBe('1235');
		});

		it('moves caret as user types', async () => {
			const { user, input, getCaret, getSlot } = await setup({ maxLength: 4 });

			await user.click(input);

			// Initial state - caret in first slot
			expect(getCaret(0)).toBeInTheDocument();

			await user.keyboard('1');
			expect(getSlot(0)).toHaveAttribute('data-active', 'false');
			expect(getSlot(1)).toHaveAttribute('data-active', 'true');
			expect(getCaret(1)).toBeInTheDocument();

			await user.keyboard('2');
			expect(getSlot(2)).toHaveAttribute('data-active', 'true');
			expect(getCaret(2)).toBeInTheDocument();
		});

		it('shows caret in last slot when complete', async () => {
			const { user, input, getSlot, getCaret } = await setup({ maxLength: 4 });

			await user.click(input);
			await user.keyboard('1234');

			expect(getSlot(3)).toHaveAttribute('data-active', 'true');
			expect(getCaret(3)).not.toBeInTheDocument();
		});
	});

	describe('paste behavior', () => {
		it('handles paste with exact length', async () => {
			const { input } = await setup({ maxLength: 6 });

			await userEvent.click(input);
			await userEvent.paste('123456');

			expect(input.value).toBe('123456');
		});

		it('handles paste with content longer than maxLength', async () => {
			const { input } = await setup({ maxLength: 6 });

			await userEvent.click(input);
			await userEvent.paste('123456789');

			expect(input.value).toBe('123456');
		});

		it('handles paste with content shorter than maxLength', async () => {
			const { input } = await setup({ maxLength: 6 });

			await userEvent.click(input);
			await userEvent.paste('123');

			expect(input.value).toBe('123');
		});

		it('displays pasted content in slots', async () => {
			const { input, getSlot } = await setup({ maxLength: 4 });

			await userEvent.click(input);
			await userEvent.paste('1234');

			expect(getSlot(0)).toHaveTextContent('1');
			expect(getSlot(1)).toHaveTextContent('2');
			expect(getSlot(2)).toHaveTextContent('3');
			expect(getSlot(3)).toHaveTextContent('4');
		});
	});

	describe('disabled state', () => {
		it('disables input when disabled prop is true', async () => {
			const { input } = await setup({ maxLength: 6, disabled: true });

			expect(input).toBeDisabled();
		});

		it('does not accept input when disabled', async () => {
			const { user, input } = await setup({ maxLength: 6, disabled: true });

			await user.click(input);
			await user.keyboard('123');

			expect(input.value).toBe('');
		});
	});

	describe('focus behavior', () => {
		it('autofocus input', async () => {
			const { input } = await setup({ maxLength: 6, autofocus: true });

			expect(input).toHaveFocus();
		});

		it('applies focus state when focused', async () => {
			const { user, input } = await setup({ maxLength: 6 });

			await user.click(input);

			expect(input).toHaveFocus();
		});

		it('removes focus state on blur', async () => {
			const { user, input } = await setup({ maxLength: 6 });

			await user.click(input);
			expect(input).toHaveFocus();

			await user.tab();
			expect(input).not.toHaveFocus();
		});
	});

	describe('slot rendering', () => {
		it('marks active slot correctly', async () => {
			const { user, input, getSlot } = await setup({ maxLength: 4 });

			await user.click(input);
			expect(getSlot(0)).toHaveAttribute('data-active', 'true');

			await user.keyboard('12');
			expect(getSlot(0)).toHaveAttribute('data-active', 'false');
			expect(getSlot(1)).toHaveAttribute('data-active', 'false');
			expect(getSlot(2)).toHaveAttribute('data-active', 'true');
		});

		it('shows fake caret only in current slot', async () => {
			const { user, input, getCaret } = await setup({ maxLength: 4 });

			await user.click(input);
			expect(getCaret(0)).toBeInTheDocument();
			expect(getCaret(1)).not.toBeInTheDocument();

			await user.keyboard('1');
			expect(getCaret(0)).not.toBeInTheDocument();
			expect(getCaret(1)).toBeInTheDocument();
			expect(getCaret(2)).not.toBeInTheDocument();
		});

		it('does not show caret when input is complete', async () => {
			const { user, input, getCaret } = await setup({ maxLength: 4 });

			await user.click(input);
			await user.keyboard('1234');

			expect(getCaret(0)).not.toBeInTheDocument();
			expect(getCaret(1)).not.toBeInTheDocument();
			expect(getCaret(2)).not.toBeInTheDocument();
			expect(getCaret(3)).not.toBeInTheDocument();
		});

		it('renders empty slots correctly', async () => {
			const { getSlot } = await setup({ maxLength: 4 });

			expect(getSlot(0)).not.toHaveTextContent(/[0-9]/);
			expect(getSlot(1)).not.toHaveTextContent(/[0-9]/);
			expect(getSlot(2)).not.toHaveTextContent(/[0-9]/);
			expect(getSlot(3)).not.toHaveTextContent(/[0-9]/);
		});

		it('renders partially filled slots correctly', async () => {
			const { user, input, getSlot } = await setup({ maxLength: 4 });

			await user.click(input);
			await user.keyboard('12');

			expect(getSlot(0)).toHaveTextContent('1');
			expect(getSlot(1)).toHaveTextContent('2');
			expect(getSlot(2)).not.toHaveTextContent(/[0-9]/);
			expect(getSlot(3)).not.toHaveTextContent(/[0-9]/);
		});
	});

	describe('input modes', () => {
		it('supports numeric input mode', async () => {
			const { input } = await setup({ maxLength: 6, inputMode: 'numeric' });

			expect(input).toHaveAttribute('inputMode', 'numeric');
		});

		it('supports text input mode', async () => {
			const { input } = await setup({ maxLength: 6, inputMode: 'text' });

			expect(input).toHaveAttribute('inputMode', 'text');
		});

		it('supports tel input mode', async () => {
			const { input } = await setup({ maxLength: 6, inputMode: 'tel' });

			expect(input).toHaveAttribute('inputMode', 'tel');
		});
	});

	describe('different lengths', () => {
		it('works with 4 digits', async () => {
			const { user, input } = await setup({ maxLength: 4 });

			await user.click(input);
			await user.keyboard('1234');

			expect(input.value).toBe('1234');
		});

		it('works with 8 digits', async () => {
			const { user, input } = await setup({ maxLength: 8 });

			await user.click(input);
			await user.keyboard('12345678');

			expect(input.value).toBe('12345678');
		});

		it('creates correct number of slots for different lengths', async () => {
			const { getSlot } = await setup({ maxLength: 3 });

			expect(getSlot(0)).toBeInTheDocument();
			expect(getSlot(1)).toBeInTheDocument();
			expect(getSlot(2)).toBeInTheDocument();
			expect(screen.queryByTestId('slot-3')).not.toBeInTheDocument();
		});
	});
});
